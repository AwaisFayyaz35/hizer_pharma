import { Router } from "express";
import {
  createOrder,
  trackOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  approvePayment,
  rejectPayment,
} from "../controllers/order.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();
const admin = [protect, authorize("admin")];

router.post("/", createOrder);
router.get("/track", trackOrder);
router.get("/", ...admin, listOrders);
router.get("/:id", ...admin, getOrder);
router.patch("/:id/status", ...admin, updateOrderStatus);
router.patch("/:id/payment/approve", ...admin, approvePayment);
router.patch("/:id/payment/reject", ...admin, rejectPayment);

export default router;
