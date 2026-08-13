import { Router } from "express";
import { getSettings, updateSettings } from "../controllers/settings.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

// Public: checkout needs bank details + delivery fee without requiring login.
router.get("/", getSettings);
router.put("/", protect, authorize("admin"), updateSettings);

export default router;
