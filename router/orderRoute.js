import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getOrdersDetails,
  getUserOrders,
  stripeWebhookHandler,
} from "../controllers/orderController.js";

const router = express.Router();

/**
 * @route   POST /api/shop/order/checkout/add
 * @desc    Create a new order
 * @access  Private (Authenticated user)
 */
router.post("/checkout/add", authMiddleware, createOrder);

/**
 * @route   POST /api/shop/order/checkout/webhook
 * @desc    Stripe webhook for payment status updates
 * @access  Public (Stripe only)
 * @security  Token validation for webhook should be added (e.g., stripe signature check)
 */
router.post("/checkout/webhook", stripeWebhookHandler);

/**
 * @route   GET /api/shop/order/getOrders
 * @desc    Fetch all orders for a user
 * @access  Private (Authenticated user)
 */
router.get("/getOrders", authMiddleware, getUserOrders);

/**
 * @route   GET /api/shop/order/getOrderDetails/:orderId
 * @desc    Fetch specific order details for a user
 * @access  Private (Authenticated user)
 */
router.get("/getOrderDetails/:orderId", authMiddleware, getOrdersDetails);

export default router;
