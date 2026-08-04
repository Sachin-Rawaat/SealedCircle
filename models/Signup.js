// models/Signup.js
const mongoose = require("mongoose");

const SignupSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
    },

    gender: {
      type: String,
      required: true,
    },

    creativeField: {
      type: String,
      required: true,
    },

    collegeStudioCompanyName: {
      type: String,
      required: true,
      trim: true,
    },

    instagramLinkedinProfileLink: {
      type: String,
      required: true,
      trim: true,
    },

    whyAttendDepth: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent OverwriteModelError
module.exports =
  mongoose.models.Signup ||
  mongoose.model("Signup", SignupSchema);