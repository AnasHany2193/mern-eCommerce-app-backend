import mongoose from "mongoose";
import Order from "../models/Order.js";
import { imageUploadUtil } from "../utils/cloudinary.js";
import { isValidPrice } from "../utils/validators.js";
import Product from "./../models/Product.js";

export const handleImageUpload = async (req, res) => {
  try {
    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Please provide an image.",
      });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;

    const result = await imageUploadUtil(url);

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error uploading image. Please try again later.",
      error: error.message,
    });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      brand,
      image,
      category,
      salePrice,
      totalStock,
      description,
    } = req.body;

    // Validation: Check for missing fields
    if (
      !title ||
      !price ||
      !brand ||
      !image ||
      !category ||
      !totalStock ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all required fields (title, price, brand, image, category, totalStock, description).",
      });
    }

    // Validate price and salePrice (if present)
    if (isNaN(price) || price <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid price." });
    }

    if (salePrice && (isNaN(salePrice) || salePrice < 0 || salePrice > price)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid sale price. It should be less than or equal to the original price.",
      });
    }

    // Validate totalStock
    if (isNaN(totalStock) || totalStock < 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid total stock." });
    }

    const newProduct = new Product({
      title,
      price,
      brand,
      image,
      category,
      salePrice,
      totalStock,
      description,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error adding product",
    });
  }
};

export const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error Fetching products" });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate product ID
    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required." });

    const {
      title,
      price,
      brand,
      image,
      category,
      salePrice,
      totalStock,
      description,
    } = req.body;

    let product = await Product.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });

    // Validate price and salePrice
    if (price && !isValidPrice(price))
      return res
        .status(400)
        .json({ success: false, message: "Invalid price value." });

    if (!salePrice)
      return res
        .status(400)
        .json({ success: false, message: "Invalid sale price value." });

    // Validate totalStock
    if (!totalStock)
      return res
        .status(400)
        .json({ success: false, message: "Invalid stock value." });

    product.title = title ?? product.title;
    product.price = price === undefined ? product.price : price;
    product.brand = brand ?? product.brand;
    product.image = image ?? product.image;
    product.category = category ?? product.category;
    product.salePrice = salePrice === undefined ? product.salePrice : salePrice;
    product.totalStock =
      totalStock === undefined ? product.totalStock : totalStock;
    product.description = description ?? product.description;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating product.",
      error: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting product",
      error: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .select(
        "_id cartId totalAmount orderStatus paymentStatus paymentId createdAt"
      ) // Select only necessary fields
      .lean(); // Return plain objects for faster access

    if (!orders.length)
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting orders",
      error: error.message,
    });
  }
};

export const getOrdersDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Validate orderId format (assuming it's a valid MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    const order = await Order.findById(orderId).lean();

    if (!order)
      return res.status(404).json({
        success: false,
        message: "No order found",
      });

    res.status(200).json({
      success: true,
      message: "order fetched successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting order details",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus } = req.body;

    // Validate orderId format (assuming it's a valid MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    // Validate orderStatus (assuming specific allowed statuses)
    const allowedStatuses = [
      "inProcess",
      "inShipping",
      "cancelled",
      "pending",
      "delivered",
    ];
    if (!orderStatus || !allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
        allowedStatuses,
      });
    }

    // Find the order and validate existence
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order found with the provided ID",
      });
    }

    // Update the order's status
    order.orderStatus = orderStatus;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message,
    });
  }
};
