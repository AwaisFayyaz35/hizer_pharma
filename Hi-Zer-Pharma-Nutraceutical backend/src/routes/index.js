import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import orderRoutes from "./order.routes.js";
import customerRoutes from "./customer.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import uploadRoutes from "./upload.routes.js";
import contactRoutes from "./contact.routes.js";

const router = Router();

router.get("/health", (req, res) => res.json({ success: true, message: "OK" }));

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/customers", customerRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/upload", uploadRoutes);
router.use("/contact", contactRoutes);

export default router;
