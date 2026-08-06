import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ok } from "../utils/apiResponse.js";
import { uploadBufferToCloudinary, PRODUCT_IMAGE_TRANSFORMATION } from "../utils/cloudinaryUpload.js";

export const uploadProductImage = asyncHandler(async function uploadProductImage(req, res) {
  if (!req.file) throw new ApiError(400, "No image file provided");

  const result = await uploadBufferToCloudinary(
    req.file.buffer,
    "hizer/products",
    "image",
    PRODUCT_IMAGE_TRANSFORMATION
  );
  ok(res, { url: result.secure_url, publicId: result.public_id }, "Image uploaded");
});

export const uploadPrescriptionFile = asyncHandler(async function uploadPrescriptionFile(req, res) {
  if (!req.file) throw new ApiError(400, "No file provided");

  const result = await uploadBufferToCloudinary(req.file.buffer, "hizer/prescriptions", "auto");
  ok(res, { url: result.secure_url, publicId: result.public_id }, "Prescription uploaded");
});
