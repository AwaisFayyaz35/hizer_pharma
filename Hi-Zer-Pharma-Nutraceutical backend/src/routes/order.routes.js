import { Router } from "express";
import {
  createOrder,
  trackOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();
const admin = [protect, authorize("admin")];

router.post("/", createOrder);
router.get("/track", trackOrder);
router.get("/", ...admin, listOrders);
router.get("/:id", ...admin, getOrder);
router.patch("/:id/status", ...admin, updateOrderStatus);

export default router;
