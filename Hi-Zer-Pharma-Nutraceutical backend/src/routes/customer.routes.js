import { Router } from "express";
import { listCustomers, getCustomer } from "../controllers/customer.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();
const admin = [protect, authorize("admin")];

router.get("/", ...admin, listCustomers);
router.get("/:email", ...admin, getCustomer);

export default router;
