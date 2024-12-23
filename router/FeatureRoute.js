import express from "express";
import {
  addFeatureImage,
  getFeatureImages,
} from "../controllers/featureController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Add a feature image
// /api/feature/image/add
router.post("/image/add", authMiddleware, isAdmin, addFeatureImage);

// Get all feature images
// /api/feature/image/get
router.get("/image/get", getFeatureImages);

export default router;
