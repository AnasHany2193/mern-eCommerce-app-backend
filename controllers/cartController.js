import mongoose from "mongoose";

import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const { _id: userId } = req.user;

    // Validate required fields
    if (!productId || typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid input. Please provide a valid productId, and a positive quantity.",
      });
    }

    // Validate product existence
    const product = await Product.findById(productId).select("_id totalStock");
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found." });

    // Fetch user's cart or create a new one
    let cart = await Cart.findOne({ userId });
    if (!cart)
      cart = new Cart({
        userId,
        items: [],
      });

    // Check if the product is already in the cart
    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    // Update or add product to the cart
    if (productIndex === -1) {
      cart.items.push({ productId, quantity });
    } else {
      cart.items[productIndex].quantity += quantity;

      // Ensure stock isn't exceeded
      if (cart.items[productIndex].quantity > product.totalStock) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Only ${product.totalStock} units available.`,
        });
      }
    }

    await cart.save();

    res.status(201).json({
      success: true,
      message: "Product added to cart successfully.",
      data: {
        cartId: cart._id,
        userId: cart.userId,
        items: cart.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Error adding product to cart",
    });
  }
};

export const fetchCartItem = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    // Fetch the user's cart and populate product details
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice totalStock",
    });

    // If no cart found
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty or not found.",
      });
    }

    // Filter out invalid or deleted products
    const validItems = cart.items.filter((item) => item.productId);

    // Update the cart if invalid items were found
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    // Prepare the response data
    const populatedItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
      totalStock: item.productId.totalStock,
    }));

    res.status(200).json({
      success: true,
      data: {
        cartId: cart._id,
        userId: cart.userId,
        items: populatedItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart items.",
      error: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const { _id: userId } = req.user;

    // Validate required fields
    if (
      !productId ||
      !mongoose.Types.ObjectId.isValid(productId) ||
      typeof quantity !== "number" ||
      quantity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid input. Please provide a valid  productId, and a positive quantity.",
      });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty or not found.",
      });
    }

    // Find the product in the cart
    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId.toString()
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart.",
      });
    }

    // Update the product quantity
    cart.items[productIndex].quantity = quantity;

    // Save the updated cart
    await cart.save();

    // Populate the product details
    await cart.populate({
      path: "items.productId",
      select: "image title price salePrice totalStock",
    });

    // Filter and prepare response data
    const validItems = cart.items.filter((item) => item.productId); // Exclude invalid products
    const populatedItems = validItems.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      message: "Cart item updated successfully.",
      data: {
        cartId: cart._id,
        userId: cart.userId,
        items: populatedItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating cart item.",
      error: error.message,
    });
  }
};

export const deleteCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { _id: userId } = req.user;

    // Validate required fields
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid input. Please provide a valid productId.",
      });
    }

    // Find the user's cart
    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "image title price salePrice",
    });

    if (!cart || cart.items.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty or not found.",
      });
    }

    // Remove the product from the cart
    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(
      (item) => item.productId && item.productId._id.toString() !== productId
    );

    // If no item was removed, return an error
    if (cart.items.length === initialItemCount) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart.",
      });
    }

    // Save the updated cart
    await cart.save();

    // Prepare the response data
    const populatedItems = cart.items.map((item) => ({
      productId: item.productId._id,
      image: item.productId.image,
      title: item.productId.title,
      price: item.productId.price,
      salePrice: item.productId.salePrice,
      quantity: item.quantity,
    }));

    res.status(200).json({
      success: true,
      message: "Cart item deleted successfully.",
      data: {
        cartId: cart._id,
        userId: cart.userId,
        items: populatedItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting cart item.",
      error: error.message,
    });
  }
};
