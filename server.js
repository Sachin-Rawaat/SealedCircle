require("dotenv").config();
const express = require("express");
const path = require("path");
const QRCode = require("qrcode");
const connectDB = require("./lib/db");
const Details = require("./models/Signup");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Parse request body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* ===========================================
   Save Details API
=========================================== */
app.post("/api/details", async (req, res) => {
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

  if (
    !fullName ||
    !email ||
    !phone ||
    age === undefined ||
    age === null ||
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
    await connectDB();

    const doc = await Details.create({
      fullName,
      email,
      phone,
      age,
      gender,
      creativeField,
      collegeStudioCompanyName,
      instagramLinkedinProfileLink,
      whyAttendDepth,
    });

    res.json({
      ok: true,
      message: "Details saved",
      id: doc._id,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: "This email is already registered",
      });
    }

    console.error(err);

    res.status(500).json({
      ok: false,
      message: "Could not save your details",
    });
  }
});

/* ===========================================
   QR Code API
=========================================== */
app.get("/api/qrcode", async (req, res) => {
  try {
    const text = req.query.text;

    if (!text) {
      return res.status(400).send("Missing text");
    }

    const buffer = await QRCode.toBuffer(text, {
      type: "png",
      width: 300,
      margin: 1,
    });

    res.setHeader("Content-Type", "image/png");
    res.send(buffer);
  } catch (err) {
    console.error("QR Error:", err);
    res.status(500).send("QR generation failed");
  }
});

/* ===========================================
   SPA Fallback
=========================================== */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ===========================================
   Start Server
=========================================== */
app.listen(PORT, () => {
  console.log(`SealedCircle server running → http://localhost:${PORT}`);
});