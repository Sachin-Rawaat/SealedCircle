// api/details.js
const connectDB = require("../lib/db");
const Details = require("../models/Signup");

module.exports = async (req, res) => {
  // Only allow POST requests
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
    org,
    instagram,
    portfolio,
  } = req.body || {};

  // Required fields
  if (!fullName || !email || !phone) {
    return res.status(400).json({
      ok: false,
      message: "Missing required fields",
    });
  }

  try {
    // Connect MongoDB
    await connectDB();

    // Save data
    const doc = await Details.create({
      fullName,
      email,
      phone,
      age,
      gender,
      creativeField,
      org,
      instagram,
      portfolio,
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
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Could not save your details",
    });
  }
};