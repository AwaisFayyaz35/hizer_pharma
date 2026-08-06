import { Router } from "express";
import { uploadProductImage, uploadPrescriptionFile } from "../controllers/upload.controller.js";
import { uploadImage, uploadPrescription } from "../middleware/upload.middleware.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/product-image",
  protect,
  authorize("admin"),
  uploadImage.single("image"),
  uploadProductImage
);
router.post("/prescription", uploadPrescription.single("file"), uploadPrescriptionFile);

export default router;
