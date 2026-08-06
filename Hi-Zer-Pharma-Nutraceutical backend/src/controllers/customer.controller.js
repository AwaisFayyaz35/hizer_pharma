import Order from "../models/Order.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ok } from "../utils/apiResponse.js";

export const listCustomers = asyncHandler(async function listCustomers(req, res) {
  const customers = await Order.aggregate([
    {
      $group: {
        _id: "$shippingAddress.email",
        name: { $first: { $concat: ["$shippingAddress.firstName", " ", "$shippingAddress.lastName"] } },
        email: { $first: "$shippingAddress.email" },
        phone: { $first: "$shippingAddress.phone" },
        orders: { $sum: 1 },
        spent: { $sum: "$total" },
        lastOrderAt: { $max: "$createdAt" },
      },
    },
    { $sort: { lastOrderAt: -1 } },
  ]);

  ok(res, customers);
});

export const getCustomer = asyncHandler(async function getCustomer(req, res) {
  const email = req.params.email.toLowerCase();
  const orders = await Order.find({ "shippingAddress.email": email }).sort({ createdAt: -1 });
  if (orders.length === 0) throw new ApiError(404, "No customer found with this email");

  const { firstName, lastName, phone } = orders[0].shippingAddress;
  ok(res, {
    name: `${firstName} ${lastName}`,
    email,
    phone,
    orders,
    spent: orders.reduce((sum, o) => sum + o.total, 0),
  });
});
