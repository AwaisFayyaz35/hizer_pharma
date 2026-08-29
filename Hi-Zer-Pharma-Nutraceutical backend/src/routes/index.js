import { Router } from "express";
import authRoutes from "./auth.routes.js";
import productRoutes from "./product.routes.js";
import categoryRoutes from "./category.routes.js";
import orderRoutes from "./order.routes.js";
import customerRoutes from "./customer.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import uploadRoutes from "./upload.routes.js";
import contactRoutes from "./contact.routes.js";
<<<<<<< HEAD
=======
import settingsRoutes from "./settings.routes.js";
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7

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
<<<<<<< HEAD
=======
router.use("/settings", settingsRoutes);
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7

export default router;
