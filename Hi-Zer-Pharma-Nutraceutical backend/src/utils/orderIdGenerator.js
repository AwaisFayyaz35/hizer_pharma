import Order from "../models/Order.js";

export async function generateOrderNumber() {
  const year = new Date().getFullYear();
  const count = await Order.countDocuments({
    createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) },
  });
  const sequence = String(count + 1).padStart(3, "0");
  return `#HZ-${year}-${sequence}`;
}
