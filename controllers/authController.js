import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "./../models/User.js";
import { ENV, SECRET_KEY } from "../index.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields ツ",
    });

  try {
    const existingUser = await User.findOne(
      {
        $or: [{ username }, { email }],
      },
      "_id"
    ).collation({ locale: "en", strength: 2 });
    if (existingUser)
      return res.status(400).json({
        success: false,
        message: "Username or email already registered ツ",
      });

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ success: true, message: "Registered successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({
      success: false,
      message: "Please fill all the fields ツ",
    });

  try {
    const user = await User.findOne({ email }).select(
      "+password role username"
    );
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid email or password ツ",
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Invalid email or password ツ",
      });

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        username: user.username,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: ENV === "production",
        sameSite: "strict",
      })
      .status(201)
      .json({
        success: true,
        message: "Logged in successfully ツ",
        user: {
          id: user._id,
          role: user.role,
          email: user.email,
          username: user.username,
        },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed ツ",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: ENV === "production", // Match original cookie settings
    sameSite: "strict",
  });
  res.status(200).json({
    success: true,
    message: "Logged out successfully ツ",
  });
};

// export const authMiddleware = async (req, res, next) => {
//   const token = req.cookies?.token;

//   if (!token)
//     return res.status(401).json({
//       success: false,
//       message: "Unauthorized user! Token Not Found ツ",
//     });

//   try {
//     const decode = jwt.verify(token, SECRET_KEY);
//     req.user = decode;
//     next();
//   } catch (error) {
//     res.status(401).json({
//       success: false,
//       message: "Unauthorized user! Invalid or expired token ツ",
//       error: error.message,
//     });
//   }
// };
