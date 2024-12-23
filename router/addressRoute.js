import express from "express";
import {
  addAddress,
  deleteAddress,
  updateAddress,
  fetchAddress,
} from "../controllers/addressController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/account/address/add
 * @desc    Add a new address
 * @access  Private
 */
router.post("/add", authMiddleware, addAddress);

/**
 * @route   GET /api/account/address/get
 * @desc    Get all addresses
 * @access  Private
 */
router.get("/get", authMiddleware, fetchAddress);

/**
 * @route   DELETE /api/account/address/delete/:addressId
 * @desc    Delete an address
 * @access  Private
 */
router.delete("/delete/:addressId", authMiddleware, deleteAddress);

/**
 * @route   PUT /api/account/address/edit/:addressId
 * @desc    Edit an address
 * @access  Private
 */
router.put("/edit/:addressId", authMiddleware, updateAddress);

export default router;
