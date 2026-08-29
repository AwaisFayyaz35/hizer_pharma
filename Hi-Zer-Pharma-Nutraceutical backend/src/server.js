import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";
<<<<<<< HEAD
=======
import { schedulePaymentScreenshotCleanup } from "./jobs/cleanupPaymentScreenshots.js";
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();
<<<<<<< HEAD
=======
  schedulePaymentScreenshotCleanup();
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
  app.listen(PORT, () => {
    console.log(`Hi-Zer backend listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
