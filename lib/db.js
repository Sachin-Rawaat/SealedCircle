// lib/db.js
// Reusable MongoDB connection via Mongoose.
// On Vercel, serverless functions can be invoked many times — we cache the
// connection on `global` so we don't open a new one on every request
// (that's what actually causes "hang"/slow behavior with DBs on serverless).

const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI;

let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Add it to your .env (local) or Vercel Project Settings > Environment Variables (production)."
    );
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
