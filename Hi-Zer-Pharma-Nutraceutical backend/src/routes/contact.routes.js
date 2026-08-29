import { Router } from "express";
<<<<<<< HEAD
import { submitContactMessage } from "../controllers/contact.controller.js";

const router = Router();

router.post("/", submitContactMessage);
=======
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
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7

export default router;
