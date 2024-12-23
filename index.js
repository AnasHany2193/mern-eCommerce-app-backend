import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import authRoute from "./router/authRoute.js";
import shopRoute from "./router/shopRoute.js";
import cartRoute from "./router/cartRoute.js";
import orderRoute from "./router/orderRoute.js";
import adminRoute from "./router/adminRoute.js";
import reviewRoute from "./router/reviewRoute.js";
import featureRoute from "./router/FeatureRoute.js";
import addressRoute from "./router/addressRoute.js";
import Product from "./models/Product.js";

export const ENV = process.env.NODE_ENV;
export const PORT = process.env.PORT || 3000;
export const SECRET_KEY = process.env.JWT_SECRET;

const app = express();

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => console.log("🟢 MongoDB Connected"))
  .catch((err) => console.error("🔴 MongoDB Connection Failed:", err));

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Pragma",
      "Expires",
      "Content-Type",
      "Authorization",
      "Cache-Control",
    ],
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/shop/order/checkout/webhook", express.raw({ type: "*/*" }));

app.use(express.json());
app.get("/", (_, res) => {
  res.send("Hello, 𝕬𝖓𝖔𝖔𝖘 🖤! Welcome to eCommerce App 🚀");
});

app.use("/api/auth", authRoute);
app.use("/api/shop", shopRoute);
app.use("/api/admin", adminRoute);
app.use("/api/feature", featureRoute);
app.use("/api/shop/cart", cartRoute);
app.use("/api/shop/order", orderRoute);
app.use("/api/shop/review", reviewRoute);
app.use("/api/account/address", addressRoute);

app.listen(PORT, () => {
  console.log(
    `🟢 Hello, 𝕬𝖓𝖔𝖔𝖘 🖤! Server is running on http://localhost:${PORT}`
  );
});
