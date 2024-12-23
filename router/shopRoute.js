import express from "express";
import rateLimit from "express-rate-limit";

import {
  getProduct,
  getFilteredProducts,
  searchProducts,
} from "../controllers/shopController.js";

const getProductsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests, please try again later.",
});

const router = express.Router();

/**
 * @route GET /api/shop/products/get
 * @desc Fetch filtered products with optional query parameters (e.g., category, brand, sort)
 */
router.get("/products/get", getProductsLimiter, getFilteredProducts);

/**
 * @route GET /api/shop/products/get/:id
 * @desc Fetch a single product by ID
 */
router.get("/products/get/:id", getProductsLimiter, getProduct);

/**
 * @route GET /api/shop/products/search/:keyword
 * @desc Search products by keyword
 */
router.get("/products/search/:keyword", getProductsLimiter, searchProducts);

export default router;
