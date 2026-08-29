import mongoose from "mongoose";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "../config/constants.js";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    rx: { type: Boolean, default: false },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: { type: String, enum: ORDER_STATUSES, required: true },
    changedAt: { type: Date, default: Date.now },
    note: { type: String, default: "" },
  },
  { _id: false }
);

// screenshotUrl/screenshotPublicId are intentionally optional at the schema level
// (though always set at creation) so the cleanup cron can unset them after the
// 15-day retention window without tripping required-field validation on save.
const paymentDetailsSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, trim: true },
    screenshotUrl: { type: String },
    screenshotPublicId: { type: String },
    screenshotDeletedAt: { type: Date },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    items: { type: [orderItemSchema], required: true, validate: (v) => v.length > 0 },
    shippingAddress: { type: shippingAddressSchema, required: true },
    paymentMethod: { type: String, enum: ["bank_transfer"], default: "bank_transfer" },
    paymentDetails: { type: paymentDetailsSchema, required: true },
    paymentStatus: { type: String, enum: PAYMENT_STATUSES, default: "pending" },
    paymentApprovedAt: { type: Date },
    paymentRejectedAt: { type: Date },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    total: { type: Number, required: true },
    requiresPrescription: { type: Boolean, default: false },
    prescriptionUrl: { type: String },
    status: { type: String, enum: ORDER_STATUSES, default: "Payment Verification Pending" },
    statusHistory: {
      type: [statusHistorySchema],
      default: () => [{ status: "Payment Verification Pending" }],
    },
  },
  { timestamps: true }
);

orderSchema.index({ "shippingAddress.email": 1 });

export default mongoose.model("Order", orderSchema);
