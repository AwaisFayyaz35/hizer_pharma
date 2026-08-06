import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ok, created } from "../utils/apiResponse.js";

export const listCategories = asyncHandler(async function listCategories(req, res) {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 });
  ok(res, categories);
});

export const createCategory = asyncHandler(async function createCategory(req, res) {
  const { name, icon, subcategories } = req.body;
  if (!name) throw new ApiError(400, "Category name is required");

  const category = await Category.create({ name, icon, subcategories });
  created(res, category);
});

export const updateCategory = asyncHandler(async function updateCategory(req, res) {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, icon: req.body.icon },
    { new: true, runValidators: true }
  );
  if (!category) throw new ApiError(404, "Category not found");
  ok(res, category, "Category updated");
});

export const deleteCategory = asyncHandler(async function deleteCategory(req, res) {
  const inUse = await Product.exists({ category: req.params.id, isActive: true });
  if (inUse) throw new ApiError(400, "Cannot delete a category that still has products");

  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");
  ok(res, null, "Category deleted");
});

export const addSubcategory = asyncHandler(async function addSubcategory(req, res) {
  const { name } = req.body;
  if (!name) throw new ApiError(400, "Subcategory name is required");

  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");

  if (category.subcategories.some((s) => s.name === name)) {
    throw new ApiError(409, "Subcategory already exists");
  }

  category.subcategories.push({ name });
  await category.save();
  ok(res, category, "Subcategory added");
});

export const removeSubcategory = asyncHandler(async function removeSubcategory(req, res) {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, "Category not found");

  category.subcategories = category.subcategories.filter(
    (s) => s.name !== req.params.subName
  );
  await category.save();
  ok(res, category, "Subcategory removed");
});
