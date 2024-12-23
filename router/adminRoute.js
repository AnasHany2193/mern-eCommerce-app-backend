import express from "express";
import { upload } from "../utils/cloudinary.js";

import { isAdmin } from "../middleware/roleMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

import {
  getOrders,
  addProduct,
  editProduct,
  deleteProduct,
  getOrdersDetails,
  fetchAllProducts,
  handleImageUpload,
  updateOrderStatus,
} from "../controllers/adminController.js";

const router = express.Router();

/**
 * @route POST /api/admin/products/upload-image
 * @desc Upload an image (Admin only)
 */
router.post(
  "/products/upload-image",
  authMiddleware,
  isAdmin,
  upload,
  handleImageUpload
);

/**
 * @route POST /api/admin/products/add
 * @desc Add a product (Admin only)
 */
router.post("/products/add", authMiddleware, isAdmin, addProduct);

/**
 * @route PUT /api/admin/products/edit/:id
 * @desc Edit a product (Admin only)
 */
router.put("/products/edit/:id", authMiddleware, isAdmin, editProduct);

/**
 * @route DELETE /api/admin/products/delete/:id
 * @desc Delete a product (Admin only)
 */
router.delete("/products/delete/:id", authMiddleware, isAdmin, deleteProduct);

/**
 * @route GET /api/admin/products/get
 * @desc Fetch all products (Admin only)
 */
router.get("/products/get", authMiddleware, isAdmin, fetchAllProducts);

/**
 * @route GET /api/admin/orders/get
 * @desc Fetch all orders (Admin only)
 */
router.get("/orders/get", authMiddleware, isAdmin, getOrders);

/**
 * @route GET /api/admin/orders/getOrderDetails/:orderId
 * @desc Fetch specific order details
 */
router.get(
  "/orders/getOrderDetails/:orderId",
  authMiddleware,
  isAdmin,
  getOrdersDetails
);

/**
 * @route PUT /api/admin/orders/updateStatus/:orderId
 * @desc Update orders status (Admin only)
 */
router.put(
  "/orders/updateStatus/:orderId",
  authMiddleware,
  isAdmin,
  updateOrderStatus
);

export default router;
