import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema(
  { name: { type: String, required: true, trim: true } },
  { _id: false }
);

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    icon: { type: String, default: "🏥" },
    subcategories: { type: [subcategorySchema], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
