import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { addReview, getReviews } from "../controllers/reviewController.js";

const router = express.Router();

/**
 * @route POST /api/shop/review/add
 * @description Add a review (authentication required)
 */
router.post("/add", authMiddleware, addReview);

/**
 * @route GET /api/shop/review/get/:productId
 * @description Fetch reviews for a specific product
 */
router.get("/get/:productId", getReviews);

export default router;
