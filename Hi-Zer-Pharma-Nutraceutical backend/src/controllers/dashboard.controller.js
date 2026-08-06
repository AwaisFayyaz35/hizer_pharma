import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ok } from "../utils/apiResponse.js";
import { LOW_STOCK_THRESHOLD } from "../config/constants.js";

export const getDashboardStats = asyncHandler(async function getDashboardStats(req, res) {
  const [totalOrders, revenueAgg, totalProducts, lowStockProducts, recentOrders] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
    Product.countDocuments({ isActive: true }),
    Product.find({ isActive: true, stock: { $lt: LOW_STOCK_THRESHOLD } })
      .sort({ stock: 1 })
      .limit(10),
    Order.find().sort({ createdAt: -1 }).limit(5),
  ]);

  ok(res, {
    totalOrders,
    revenue: revenueAgg[0]?.total || 0,
    totalProducts,
    lowStockCount: lowStockProducts.length,
    lowStockProducts,
    recentOrders,
  });
});
