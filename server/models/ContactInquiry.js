import mongoose from "mongoose";

const contactInquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    learningGoal: {
      type: String,
      required: [true, "Learning goal is required"],
      trim: true,
      minlength: 3,
      maxlength: 160,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: 10,
      maxlength: 1500,
    },
  },
  {
    timestamps: true,
  }
);

const ContactInquiry =
  mongoose.models.ContactInquiry ||
  mongoose.model("ContactInquiry", contactInquirySchema);

export default ContactInquiry;
