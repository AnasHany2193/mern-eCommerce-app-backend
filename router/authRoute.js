import csrf from "csurf";
import express from "express";
import rateLimit from "express-rate-limit";

import { login, logout, register } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
export const csrfProtection = csrf({ cookie: true });

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow only 3 login attempts per 15 minutes
  message: "Too many login attempts. Please try again later.",
});

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Allow 5 registration attempts per 15 minutes
  message: "Too many registration attempts. Please try again later.",
});

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and return a JWT token
 * @access Public
 */
router.post("/login", loginLimiter, login);

/**
 * @route GET /api/auth/logout
 * @desc Logout user and clear the authentication cookie
 * @access Public
 */
router.get("/logout", csrfProtection, logout);

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */
router.post("/register", registerLimiter, register);

/**
 * @route GET /api/auth/checkAuth
 * @desc Verify authentication status and return user data
 * @access Private (requires authMiddleware)
 */
router.get("/checkAuth", csrfProtection, authMiddleware, (req, res) => {
  const { id, username, email, role } = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated User ツ",
    user: { id, username, email, role },
  });
});

export default router;
