import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: null },
    countInStock: { type: Number, default: 0 },
    image: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
