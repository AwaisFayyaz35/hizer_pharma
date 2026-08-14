import app from "../Hi-Zer-Pharma-Nutraceutical backend/src/app.js";
import { connectDB } from "../Hi-Zer-Pharma-Nutraceutical backend/src/config/db.js";

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
