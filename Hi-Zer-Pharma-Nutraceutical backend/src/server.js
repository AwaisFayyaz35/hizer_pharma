import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { schedulePaymentScreenshotCleanup } from "./jobs/cleanupPaymentScreenshots.js";

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
  schedulePaymentScreenshotCleanup();
  app.listen(PORT, () => {
    console.log(`Hi-Zer backend listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
