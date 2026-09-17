import cors from "cors";
import dns from "node:dns";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import contactRoutes from "./routes/contactRoutes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGODB_URI;
const mongoUriDirect = process.env.MONGODB_URI_DIRECT;

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

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
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

        app.listen(port, () => {
          console.log(`Server listening on port ${port}`);
        });
        return;
      } catch (fallbackError) {
        console.error("Direct URI fallback also failed:", fallbackError);
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
