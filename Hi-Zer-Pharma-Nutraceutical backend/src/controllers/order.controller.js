import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ok, created } from "../utils/apiResponse.js";
import { generateOrderNumber } from "../utils/orderIdGenerator.js";
import { FREE_DELIVERY_THRESHOLD, STANDARD_DELIVERY_FEE, ORDER_STATUSES } from "../config/constants.js";

export const createOrder = asyncHandler(async function createOrder(req, res) {
  const { items, shippingAddress, prescriptionUrl } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Cart is empty");
  }
  const requiredAddressFields = ["firstName", "lastName", "email", "phone", "street", "city", "province"];
  for (const field of requiredAddressFields) {
    if (!shippingAddress?.[field]) {
      throw new ApiError(400, `Shipping address is missing "${field}"`);
    }
  }

  const productIds = items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds }, isActive: true });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  let subtotal = 0;
  let requiresPrescription = false;
  const orderItems = items.map((item) => {
    const product = productMap.get(item.productId);
    if (!product) throw new ApiError(400, `Product ${item.productId} is not available`);
    if (product.stock < item.quantity) {
      throw new ApiError(400, `Insufficient stock for ${product.name}`);
    }
    const price = product.discountPrice ?? product.price;
    subtotal += price * item.quantity;
    if (product.rx) requiresPrescription = true;
    return {
      product: product._id,
      name: product.name,
      price,
      quantity: item.quantity,
      rx: product.rx,
    };
  });

  if (requiresPrescription && !prescriptionUrl) {
    throw new ApiError(400, "A prescription upload is required for one or more items in your cart");
  }

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : STANDARD_DELIVERY_FEE;
  const orderNumber = await generateOrderNumber();

  const order = await Order.create({
    orderNumber,
    items: orderItems,
    shippingAddress,
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    requiresPrescription,
    prescriptionUrl,
  });

  await Promise.all(
    orderItems.map((item) =>
      Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } })
    )
  );

  created(res, order, "Order placed");
});

export const trackOrder = asyncHandler(async function trackOrder(req, res) {
  const { orderNumber, contact } = req.query;
  if (!orderNumber || !contact) {
    throw new ApiError(400, "Order number and email or phone are required");
  }

  const order = await Order.findOne({
    orderNumber,
    $or: [{ "shippingAddress.email": contact.toLowerCase() }, { "shippingAddress.phone": contact }],
  });
  if (!order) throw new ApiError(404, "No matching order found");

  ok(res, order);
});

export const listOrders = asyncHandler(async function listOrders(req, res) {
  const { status, search } = req.query;
  const filter = {};
  if (status && status !== "All") filter.status = status;
  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search, $options: "i" } },
      { "shippingAddress.firstName": { $regex: search, $options: "i" } },
      { "shippingAddress.lastName": { $regex: search, $options: "i" } },
      { "shippingAddress.email": { $regex: search, $options: "i" } },
    ];
  }
  const orders = await Order.find(filter).sort({ createdAt: -1 });
  ok(res, orders);
});

export const getOrder = asyncHandler(async function getOrder(req, res) {
  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");
  ok(res, order);
});

export const updateOrderStatus = asyncHandler(async function updateOrderStatus(req, res) {
  const { status, note } = req.body;
  if (!ORDER_STATUSES.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const order = await Order.findById(req.params.id);
  if (!order) throw new ApiError(404, "Order not found");

  order.status = status;
  order.statusHistory.push({ status, note: note || "" });
  await order.save();

  ok(res, order, "Order status updated");
});
