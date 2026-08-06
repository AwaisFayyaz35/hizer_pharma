import ContactMessage from "../models/ContactMessage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { created } from "../utils/apiResponse.js";

export const submitContactMessage = asyncHandler(async function submitContactMessage(req, res) {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email, and message are required");
  }

  const entry = await ContactMessage.create({ name, email, message });
  created(res, entry, "Message sent");
});
