import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: 5,
      maxlength: 120,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      minlength: 2,
      maxlength: 40,
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      trim: true,
      minlength: 10,
      maxlength: 220,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      minlength: 40,
      maxlength: 8000,
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: 80,
      default: "Vikas Gowda",
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

blogPostSchema.index({ category: 1, createdAt: -1 });
blogPostSchema.index({ createdAt: -1 });

const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema);

export default BlogPost;
