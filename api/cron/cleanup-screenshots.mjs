import { cleanupExpiredScreenshots } from "../../Hi-Zer-Pharma-Nutraceutical backend/src/jobs/cleanupPaymentScreenshots.js";
import { connectDB } from "../../Hi-Zer-Pharma-Nutraceutical backend/src/config/db.js";

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    res.statusCode = 401;
    return res.end();
  }
  await connectDB();
  const deleted = await cleanupExpiredScreenshots();
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify({ success: true, deleted }));
}
