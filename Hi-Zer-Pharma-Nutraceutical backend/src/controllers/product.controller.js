import Product from "../models/Product.js";
import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ok, created } from "../utils/apiResponse.js";

const SORT_MAP = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  newest: { createdAt: -1 },
};

export const listProducts = asyncHandler(async function listProducts(req, res) {
  const { search, category, featured, sort, page = 1, limit = 24 } = req.query;

  const filter = { isActive: true };
  if (search) {
    filter.$text = { $search: search };
  }
  if (category && category !== "All") {
    const cat = await Category.findOne({ name: category });
    filter.category = cat ? cat._id : null;
  }
  if (featured === "true") {
    filter.featured = true;
  }

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 24));

  const [items, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name")
      .sort(SORT_MAP[sort] || { createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  ok(res, { items, total, page: pageNum, pages: Math.ceil(total / limitNum) });
});

export const getProduct = asyncHandler(async function getProduct(req, res) {
  const product = await Product.findOne({ _id: req.params.id, isActive: true }).populate(
    "category",
    "name"
  );
  if (!product) throw new ApiError(404, "Product not found");
  ok(res, product);
});

export const createProduct = asyncHandler(async function createProduct(req, res) {
  const category = await Category.findById(req.body.category);
  if (!category) throw new ApiError(400, "Invalid category");

  const product = await Product.create(req.body);
  created(res, product);
});

export const updateProduct = asyncHandler(async function updateProduct(req, res) {
  if (req.body.category) {
    const category = await Category.findById(req.body.category);
    if (!category) throw new ApiError(400, "Invalid category");
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new ApiError(404, "Product not found");
  ok(res, product, "Product updated");
});

export const deleteProduct = asyncHandler(async function deleteProduct(req, res) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");

  await Promise.all(
    product.images.map((image) =>
      cloudinary.uploader.destroy(image.publicId).catch((err) => {
        console.error(`Product delete: failed to remove image ${image.publicId}:`, err.message);
      })
    )
  );

  ok(res, null, "Product deleted");
});
