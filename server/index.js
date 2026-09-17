import cors from "cors";
import { exec as execCallback } from "node:child_process";
import dns from "node:dns";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { promisify } from "node:util";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI;
const mongoUriDirect = process.env.MONGODB_URI_DIRECT;
const exec = promisify(execCallback);

if (process.env.DNS_SERVERS) {
  dns.setServers(
    process.env.DNS_SERVERS.split(",")
      .map((server) => server.trim())
      .filter(Boolean)
  );
}

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);
app.use(express.json());

app.get("/api/health", (_, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use("/api/contact", contactRoutes);

const startHttpServer = () => {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
};

const extractMongoHostsFromNslookup = (rawOutput) => {
  const hostPattern = /([a-z0-9-]+(?:\.[a-z0-9-]+)+\.mongodb\.net)\.?/gi;
  const hosts = new Set();
  let match;

  while ((match = hostPattern.exec(rawOutput)) !== null) {
    const host = match[1].toLowerCase();
    if (host.includes("shard-")) {
      hosts.add(host);
    }
  }

  return [...hosts];
};

const buildDirectUriFromSrvUri = (srvUri, hosts) => {
  const parsed = new URL(srvUri);
  const username = decodeURIComponent(parsed.username || "");
  const password = decodeURIComponent(parsed.password || "");
  const auth = username
    ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@`
    : "";
  const databaseName = parsed.pathname.replace(/^\//, "") || "test";
  const query = new URLSearchParams(parsed.search);

  // Ensure TLS and auth DB are set for Atlas seed-list connections.
  if (!query.has("ssl") && !query.has("tls")) {
    query.set("ssl", "true");
  }
  if (!query.has("authSource")) {
    query.set("authSource", "admin");
  }

  const seedList = hosts.map((host) => `${host}:27017`).join(",");
  return `mongodb://${auth}${seedList}/${databaseName}?${query.toString()}`;
};

const startServer = async () => {
  if (!mongoUri && !mongoUriDirect) {
    console.error("Set MONGODB_URI or MONGODB_URI_DIRECT in environment variables.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri || mongoUriDirect, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log("MongoDB connected");
    startHttpServer();
  } catch (error) {
    const isSrvDnsError =
      error.code === "ECONNREFUSED" &&
      error.syscall === "querySrv" &&
      mongoUri?.startsWith("mongodb+srv://");

    if (isSrvDnsError && mongoUriDirect) {
      try {
        console.warn("SRV DNS lookup failed, retrying with MONGODB_URI_DIRECT.");

        await mongoose.connect(mongoUriDirect, {
          serverSelectionTimeoutMS: 10000,
        });
        console.log("MongoDB connected via direct URI fallback");
        startHttpServer();
        return;
      } catch (fallbackError) {
        console.error("Direct URI fallback also failed:", fallbackError);
      }
    }

    if (isSrvDnsError && !mongoUriDirect) {
      try {
        const srvHostname = new URL(mongoUri).hostname;
        const { stdout, stderr } = await exec(
          `nslookup -type=SRV _mongodb._tcp.${srvHostname}`
        );
        const hosts = extractMongoHostsFromNslookup(`${stdout}\n${stderr}`);

        if (!hosts.length) {
          throw new Error("Could not extract Mongo shard hosts from nslookup output.");
        }

        const generatedDirectUri = buildDirectUriFromSrvUri(mongoUri, hosts);
        console.warn("SRV DNS lookup failed, retrying with auto-generated direct URI.");

        await mongoose.connect(generatedDirectUri, {
          serverSelectionTimeoutMS: 10000,
        });
        console.log("MongoDB connected via auto-generated direct URI fallback");
        startHttpServer();
        return;
      } catch (generatedFallbackError) {
        console.error(
          "Auto-generated direct URI fallback failed:",
          generatedFallbackError
        );
      }
    }

    if (isSrvDnsError) {
      console.error(
        "MongoDB SRV DNS lookup failed. Use MONGODB_URI_DIRECT from Atlas 'Drivers > Node.js > Show all connection options' or set DNS_SERVERS=1.1.1.1,8.8.8.8."
      );
    }
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

startServer();
