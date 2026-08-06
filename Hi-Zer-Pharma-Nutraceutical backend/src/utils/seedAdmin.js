import "dotenv/config";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import mongoose from "mongoose";

async function run() {
  await connectDB();

  const email = (process.env.ADMIN_SEED_EMAIL || "admin@hi-zer.com").toLowerCase();
  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
  } else {
    await User.create({
      name: process.env.ADMIN_SEED_NAME || "Hi-Zer Admin",
      email,
      password: process.env.ADMIN_SEED_PASSWORD || "change_this_password_123",
      role: "admin",
    });
    console.log(`Admin created: ${email}`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
