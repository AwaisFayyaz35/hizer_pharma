import { Router } from "express";
import {
  uploadProductImage,
  uploadPrescriptionFile,
  uploadPaymentScreenshotFile,
  uploadQrCodeImage,
} from "../controllers/upload.controller.js";
import { uploadImage, uploadPrescription, uploadPaymentScreenshot } from "../middleware/upload.middleware.js";
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
// Public: customers upload their payment screenshot at checkout, before an account exists.
router.post(
  "/payment-screenshot",
  uploadPaymentScreenshot.single("file"),
  uploadPaymentScreenshotFile
);
router.post(
  "/qr-code",
  protect,
  authorize("admin"),
  uploadImage.single("image"),
  uploadQrCodeImage
);

export default router;
