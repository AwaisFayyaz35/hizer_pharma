import { Router } from "express";
<<<<<<< HEAD
import { uploadProductImage, uploadPrescriptionFile } from "../controllers/upload.controller.js";
import { uploadImage, uploadPrescription } from "../middleware/upload.middleware.js";
=======
import {
  uploadProductImage,
  uploadPrescriptionFile,
  uploadPaymentScreenshotFile,
  uploadQrCodeImage,
} from "../controllers/upload.controller.js";
import { uploadImage, uploadPrescription, uploadPaymentScreenshot } from "../middleware/upload.middleware.js";
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
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
<<<<<<< HEAD
=======
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
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7

export default router;
