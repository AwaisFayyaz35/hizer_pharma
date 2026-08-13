import { Router } from "express";
import {
  submitContactMessage,
  listContactMessages,
  deleteContactMessage,
} from "../controllers/contact.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();
const admin = [protect, authorize("admin")];

router.post("/", submitContactMessage);
router.get("/", ...admin, listContactMessages);
router.delete("/:id", ...admin, deleteContactMessage);

export default router;
