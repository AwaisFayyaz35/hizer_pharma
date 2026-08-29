import { Router } from "express";
import {
  createOrder,
  trackOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
<<<<<<< HEAD
=======
  approvePayment,
  rejectPayment,
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
} from "../controllers/order.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();
const admin = [protect, authorize("admin")];

router.post("/", createOrder);
router.get("/track", trackOrder);
router.get("/", ...admin, listOrders);
router.get("/:id", ...admin, getOrder);
router.patch("/:id/status", ...admin, updateOrderStatus);
<<<<<<< HEAD
=======
router.patch("/:id/payment/approve", ...admin, approvePayment);
router.patch("/:id/payment/reject", ...admin, rejectPayment);
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7

export default router;
