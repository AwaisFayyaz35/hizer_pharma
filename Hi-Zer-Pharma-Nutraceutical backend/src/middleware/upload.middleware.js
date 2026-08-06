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
