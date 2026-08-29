import multer from "multer";

const storage = multer.memoryStorage();

function imageFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/")) return cb(null, true);
  cb(new Error("Only image files are allowed"));
}

function prescriptionFilter(req, file, cb) {
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf") {
    return cb(null, true);
  }
  cb(new Error("Only JPG, PNG, or PDF files are allowed"));
}

<<<<<<< HEAD
=======
const PAYMENT_SCREENSHOT_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function paymentScreenshotFilter(req, file, cb) {
  if (PAYMENT_SCREENSHOT_MIME_TYPES.includes(file.mimetype)) return cb(null, true);
  cb(new Error("Only JPG, JPEG, PNG, or WEBP files are allowed"));
}

>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter,
});

export const uploadPrescription = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: prescriptionFilter,
});
<<<<<<< HEAD
=======

export const uploadPaymentScreenshot = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: paymentScreenshotFilter,
});
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
