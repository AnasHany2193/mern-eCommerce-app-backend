import mongoose from "mongoose";
import Review from "../models/Review.js";
import Order from "./../models/Order.js";
import Product from "./../models/Product.js";

export const addReview = async (req, res) => {
  try {
    const { productId, review, rate } = req.body;
    const { _id: userId, username } = req.user;

    // Validate input data
    if (
      !productId ||
      !review ||
      typeof rate !== "number" ||
      rate < 1 ||
      rate > 5
    )
      return res.status(400).json({
        success: false,
        message: "Invalid input data. Ensure all fields are valid.",
      });

    // Check if the user has purchased the product
    const order = await Order.findOne({
      userId,
      "cartItems.productId": productId,
      paymentStatus: "paid",
    });

    if (!order)
      return res.status(400).json({
        message: "You must purchase the product before leaving a review.",
      });

    // Check if the user has already reviewed the product
    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview)
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product.",
      });

    // Add new review
    const newReview = await Review.create({
      userId,
      username,
      productId,
      review,
      rate,
    });

    // Update product's average rating
    const [averageRateData] = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: "$productId",
          averageRate: { $avg: "$rate" },
        },
      },
    ]);

    await Product.findByIdAndUpdate(productId, {
      averageRate: averageRateData?.averageRate || rate,
    });

    res.status(201).json({
      message: "Review added successfully.",
      success: true,
      data: newReview,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID.",
      });
    }

    const reviews = await Review.find({ productId }).select(
      "userId username review rate createdAt"
    );

    res.status(200).json({
      message: "Reviews fetched successfully.",
      success: true,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
