import { Router } from "express";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  addSubcategory,
  removeSubcategory,
} from "../controllers/category.controller.js";
import { protect, authorize } from "../middleware/auth.middleware.js";

const router = Router();
const admin = [protect, authorize("admin")];

router.get("/", listCategories);
router.post("/", ...admin, createCategory);
router.put("/:id", ...admin, updateCategory);
router.delete("/:id", ...admin, deleteCategory);
router.post("/:id/subcategories", ...admin, addSubcategory);
router.delete("/:id/subcategories/:subName", ...admin, removeSubcategory);

export default router;
