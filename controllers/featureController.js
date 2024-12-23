import Feature from "../models/Feature.js";

export const addFeatureImage = async (req, res) => {
  try {
    const { image } = req.body;

    // Validate input
    if (!image || typeof image !== "string") {
      return res.status(400).json({
        message: "Invalid image data",
        success: false,
      });
    }

    // Save the feature image
    const newFeatureImage = new Feature({ image });
    await newFeatureImage.save();

    res.status(201).json({
      message: "Feature image added successfully",
      success: true,
      data: newFeatureImage,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

export const getFeatureImages = async (req, res) => {
  try {
    const images = await Feature.find();

    if (!images.length) {
      return res.status(404).json({
        message: "No feature images found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Feature images retrieved successfully",
      success: true,
      data: images,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
