// api/details.js — Vercel serverless function.
// Runs ONLY when someone hits /api/details (your static pages never touch this).

const connectDB = require("../lib/db");
const Details = require("../models/Signup");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  const { fullName, email, phone, age, gender, creativeField, org, instagram, portfolio } =
    req.body || {};

  if (!fullName || !email || !phone) {
    return res.status(400).json({ ok: false, message: "Missing required fields" });
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
      org,
      instagram,
      portfolio,
    });

    return res.status(200).json({ ok: true, message: "Details saved", id: doc._id });
  } catch (err) {
    if (err.code === 11000) {
      // duplicate key (e.g. unique email index, if you add one later)
      return res.status(409).json({ ok: false, message: "This email is already registered" });
    }
    console.error("Details save error:", err);
    return res.status(500).json({ ok: false, message: "Could not save your details, please try again" });
  }
};

app.get("/api/qrcode", async (req, res) => {
  try {
    const { text } = req.query;

    if (!text) {
      return res.status(400).send("Missing text");
    }

    const png = await QRCode.toBuffer(text, {
      width: 250,
      margin: 1,
    });

    res.setHeader("Content-Type", "image/png");
    res.send(png);
  } catch (err) {
    console.error(err);
    res.status(500).send("QR Error");
  }
});