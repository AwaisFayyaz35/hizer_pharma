import mongoose from "mongoose";
import { STANDARD_DELIVERY_FEE } from "../config/constants.js";

const settingsSchema = new mongoose.Schema(
  {
    bankName: { type: String, default: "", trim: true },
    accountTitle: { type: String, default: "", trim: true },
    accountNumber: { type: String, default: "", trim: true },
    iban: { type: String, default: "", trim: true },
    qrCodeImage: {
      url: { type: String },
      publicId: { type: String },
    },
    deliveryFee: { type: Number, default: STANDARD_DELIVERY_FEE, min: 0 },
  },
  { timestamps: true }
);

// The app has exactly one settings document. Lazily create it on first read
// so there's no seed script to remember to run.
settingsSchema.statics.getSingleton = async function getSingleton() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model("Settings", settingsSchema);
