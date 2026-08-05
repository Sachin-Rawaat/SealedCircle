// api/details.js

const connectDB = require("../lib/db");
const Details = require("../models/Signup");

module.exports = async (req, res) => {
  // Allow only POST
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({
      ok: false,
      message: "Method Not Allowed",
    });
  }

  const {
    fullName,
    email,
    phone,
    age,
    gender,
    creativeField,
    collegeStudioCompanyName,
    instagramLinkedinProfileLink,
    whyAttendDepth,
  } = req.body || {};

  // Validation
  if (
    !fullName ||
    !email ||
    !phone ||
    age === undefined ||
    age === "" ||
    !gender ||
    !creativeField ||
    !collegeStudioCompanyName ||
    !instagramLinkedinProfileLink
  ) {
    return res.status(400).json({
      ok: false,
      message: "Missing required fields",
    });
  }

  try {
    // Connect MongoDB
    await connectDB();

    // Save Details
    const doc = await Details.create({
      fullName,
      email,
      phone,
      age: Number(age),
      gender,
      creativeField,
      collegeStudioCompanyName,
      instagramLinkedinProfileLink,
      whyAttendDepth: whyAttendDepth || "",
    });

    return res.status(200).json({
      ok: true,
      message: "Details saved successfully",
      id: doc._id,
    });
  } catch (err) {
    console.error("Details Save Error:", err);

    if (err.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: "This email is already registered",
      });
    }

    return res.status(500).json({
      ok: false,
      message: err.message || "Could not save your details",
    });
  }
};