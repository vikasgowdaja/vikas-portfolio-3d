import { Router } from "express";
import ContactInquiry from "../models/ContactInquiry.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, learningGoal, message } = req.body;

    if (!name || !email || !learningGoal || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const createdInquiry = await ContactInquiry.create({
      name,
      email,
      learningGoal,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Thanks for reaching out. Your request has been saved.",
      inquiryId: createdInquiry._id,
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

    console.error("Contact submission error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while saving your request.",
    });
  }
});

export default router;
