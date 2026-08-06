import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export function uploadBufferToCloudinary(buffer, folder, resourceType = "auto", transformation) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, ...(transformation ? { transformation } : {}) },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

// Caps product photos at a sane max width (never upscales, never crops — "limit"
// just scales down oversized uploads) then lets Cloudinary's CDN pick the best
// format (WebP/AVIF/JPEG) and quality per-request at delivery time, not upload time.
export const PRODUCT_IMAGE_TRANSFORMATION = [
  { width: 1600, crop: "limit" },
  { quality: "auto", fetch_format: "auto" },
];

