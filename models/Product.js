import mongoose from "mongoose";
import validator from "validator";

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: {
      type: Number,
      required: true,
      min: [0, "Price must be a positive number"],
    },
    brand: {
      type: String,
      enum: ["nike", "adidas", "puma", "levi", "zara", "h&m"],
      required: true,
    },
    averageRate: { type: Number, min: 0, max: 5 },
    image: {
      type: String,
      required: true,
      validate: [validator.isURL, "Invalid image URL"],
    },
    category: {
      type: String,
      enum: ["men", "women", "kids", "accessories", "footwear"],
      required: true,
    },
    salePrice: { type: Number },
    totalStock: {
      type: Number,
      required: true,
      min: [0, "Stock must be a positive number"],
    },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
