import ContactMessage from "../models/ContactMessage.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
<<<<<<< HEAD
import { created } from "../utils/apiResponse.js";
=======
import { ok, created } from "../utils/apiResponse.js";
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7

export const submitContactMessage = asyncHandler(async function submitContactMessage(req, res) {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    throw new ApiError(400, "Name, email, and message are required");
  }

  const entry = await ContactMessage.create({ name, email, message });
  created(res, entry, "Message sent");
});
<<<<<<< HEAD
=======

export const listContactMessages = asyncHandler(async function listContactMessages(req, res) {
  const messages = await ContactMessage.find().sort({ createdAt: -1 });
  ok(res, messages);
});

export const deleteContactMessage = asyncHandler(async function deleteContactMessage(req, res) {
  const message = await ContactMessage.findByIdAndDelete(req.params.id);
  if (!message) throw new ApiError(404, "Message not found");
  ok(res, null, "Message deleted");
});
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
