import { Router } from "express";
import BlogPost from "../models/BlogPost.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const category = (req.query.category || "").trim();
    const query = { isPublished: true };

    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }

    const posts = await BlogPost.find(query)
      .sort({ createdAt: -1 })
      .select("title category summary content author createdAt");

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Fetching blog posts failed:", error);
    return res.status(500).json({
      success: false,
      message: "Could not fetch blog posts.",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, category, summary, content, author } = req.body;

    if (!title || !category || !summary || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, category, summary, and content are required.",
      });
    }

    const createdPost = await BlogPost.create({
      title,
      category,
      summary,
      content,
      author: author || "Vikas Gowda",
    });

    return res.status(201).json({
      success: true,
      message: "Blog post published successfully.",
      post: createdPost,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((item) => item.message)
          .join(" "),
      });
    }

    console.error("Publishing blog post failed:", error);
    return res.status(500).json({
      success: false,
      message: "Could not publish blog post.",
    });
  }
});

export default router;
