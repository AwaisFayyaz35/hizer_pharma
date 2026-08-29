import cron from "node-cron";
import Order from "../models/Order.js";
import cloudinary from "../config/cloudinary.js";
import { PAYMENT_SCREENSHOT_RETENTION_DAYS } from "../config/constants.js";

// Payment screenshots exist only to verify a transfer; once approved for
// PAYMENT_SCREENSHOT_RETENTION_DAYS there's no reason to keep the customer's
// bank/payment image around, so we delete it from Cloudinary and null out the
// reference in Mongo.
export async function cleanupExpiredScreenshots() {
  const cutoff = new Date(Date.now() - PAYMENT_SCREENSHOT_RETENTION_DAYS * 24 * 60 * 60 * 1000);

  const orders = await Order.find({
    paymentStatus: "approved",
    paymentApprovedAt: { $lte: cutoff },
    "paymentDetails.screenshotPublicId": { $exists: true, $ne: null },
  });

  let deleted = 0;
  for (const order of orders) {
    try {
      await cloudinary.uploader.destroy(order.paymentDetails.screenshotPublicId);
    } catch (err) {
      console.error(`Screenshot cleanup: failed to delete for order ${order.orderNumber}:`, err.message);
      continue;
    }

    order.paymentDetails.screenshotUrl = undefined;
    order.paymentDetails.screenshotPublicId = undefined;
    order.paymentDetails.screenshotDeletedAt = new Date();
    order.markModified("paymentDetails");
    await order.save();
    deleted += 1;
  }

  if (deleted) {
    console.log(`Screenshot cleanup: removed ${deleted} screenshot(s)`);
  }
  return deleted;
}

export function schedulePaymentScreenshotCleanup() {
  cron.schedule("0 3 * * *", () => {
    cleanupExpiredScreenshots().catch((err) => console.error("Screenshot cleanup job failed:", err));
  });
}
