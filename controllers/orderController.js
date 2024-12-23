import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
import mongoose from "mongoose";
import Cart from "./../models/Cart.js";
import Order from "./../models/Order.js";
import Product from "./../models/Product.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  try {
    const { cartItems, address, totalAmount, cartId } = req.body;
    const { _id: userId } = req.user;

    if (!cartItems.length || !address)
      return res
        .status(400)
        .json({ success: false, message: "Invalid request data" });

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [item.image],
        },
        unit_amount: Math.round(
          (item.salePrice > 0 ? item.salePrice : item.price) * 100
        ),
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: lineItems,
      metadata: { userId: userId.toString() },
      success_url: `${process.env.FRONTEND_URL}/account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/checkout`,
    });

    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      address,
      totalAmount,
      orderStatus: "pending",
      paymentMethod: "stripe",
      paymentStatus: "pending",
      paymentId: session.id,
    });

    await newOrder.save();

    res.status(200).json({
      success: true,
      orderId: newOrder._id,
      url: session.url,
      message: "Order created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error creating checkout session" });
  }
};

export const stripeWebhookHandler = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // Find the order linked to the payment session
      const order = await Order.findOne({ paymentId: session.id });

      if (!order)
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });

      // Update the order payment and status
      order.paymentStatus = "paid";
      order.orderStatus = "inProcess";

      // Validate and update product stock using a single batch operation
      const stockUpdates = order.cartItems.map(async (item) => {
        const product = await Product.findById(item.productId);

        if (!product || product.totalStock < item.quantity)
          return res.status(400).json({
            success: false,
            message: `Not enough stock for product: ${
              product?.title || "Unknown"
            }`,
          });

        product.totalStock -= item.quantity;
        return product.save();
      });

      // Execute all updates concurrently
      await Promise.all([
        ...stockUpdates,
        order.save(),
        Cart.findByIdAndDelete(order.cartId),
      ]);

      res.status(200).json({
        success: true,
        message: "Order confirmed successfully",
      });
    } else
      res.status(400).json({
        success: false,
        message: "Unhandled event type",
      });
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const { _id: userId } = req.user;

    const orders = await Order.find({ userId })
      .select(
        "_id cartId totalAmount orderStatus paymentStatus paymentId createdAt"
      ) // Select only necessary fields
      .lean(); // Return plain objects for faster access

    if (!orders.length)
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting orders",
      error: error.message,
    });
  }
};

export const getOrdersDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Validate orderId format (assuming it's a valid MongoDB ObjectId)
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format",
      });
    }

    const { _id: userId } = req.user;

    const order = await Order.findOne({ userId, _id: orderId }).lean();

    if (!order)
      return res.status(404).json({
        success: false,
        message: "No order found",
      });

    res.status(200).json({
      success: true,
      message: "order fetched successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error getting order",
      error: error.message,
    });
  }
};
