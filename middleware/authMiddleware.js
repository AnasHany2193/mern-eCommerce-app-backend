import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { SECRET_KEY } from "./../index.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. No token provided.",
      });
    }

    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = await User.findById(decoded.id).select("username email role");
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User not found.",
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid token.",
    });
  }
};
