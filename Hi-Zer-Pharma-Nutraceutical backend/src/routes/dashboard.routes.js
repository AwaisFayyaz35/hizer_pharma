import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/stats", protect, authorize("admin"), getDashboardStats);

export default router;
