export const LOW_STOCK_THRESHOLD = 30;
export const FREE_DELIVERY_THRESHOLD = 5000;
<<<<<<< HEAD
export const STANDARD_DELIVERY_FEE = 200;
export const ORDER_STATUSES = ["Processing", "Shipped", "Received", "Delivered", "Cancelled"];
=======
// Fallback default used to seed Settings.deliveryFee; admins override this from the settings panel.
export const STANDARD_DELIVERY_FEE = 200;
export const PAYMENT_STATUSES = ["pending", "approved", "rejected"];
export const PAYMENT_SCREENSHOT_RETENTION_DAYS = 15;
export const ORDER_STATUSES = [
  "Payment Verification Pending",
  "Processing",
  "Shipped",
  "Received",
  "Delivered",
  "Cancelled",
  "Payment Rejected",
];
// Statuses an admin can set manually via the generic status endpoint. The two
// payment statuses above are only reachable through the approve/reject payment actions.
export const MANUAL_ORDER_STATUSES = ["Processing", "Shipped", "Received", "Delivered", "Cancelled"];
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
