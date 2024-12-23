import dotenv from "dotenv";
dotenv.config();

import multer from "multer";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const imageUploadUtil = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      remove_exif: true, // Remove EXIF metadata
      quality: "auto",
      fetch_format: "auto",
    });

    return result;
  } catch (error) {
    throw new Error("Failed to upload image.");
  }
};

const storage = new multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("image");
