import express from "express";

import {
  addToCart,
  fetchCartItem,
  updateCartItem,
  deleteCartItem,
} from "../controllers/cartController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/shop/cart/add
 * @desc    Add an item to the user's cart
 * @access  Private
 */
router.post("/add", authMiddleware, addToCart);

/**
 * @route   GET /api/shop/cart/get
 * @desc    Fetch the user's cart items
 * @access  Private
 */
router.get("/get", authMiddleware, fetchCartItem);

/**
 * @route   PUT /api/shop/cart/edit
 * @desc    Update a cart item (e.g., quantity)
 * @access  Private
 */
router.put("/update-cart", authMiddleware, updateCartItem);

/**
 * @route   DELETE /api/shop/cart/delete/:productId
 * @desc    Delete an item from the user's cart
 * @access  Private
 */
router.delete("/delete/:productId", authMiddleware, deleteCartItem);

export default router;
