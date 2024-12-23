import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: String,
  cartId: String,
  cartItems: [
    {
      productId: String,
      title: String,
      image: String,
      price: String,
      salePrice: String,
      quantity: Number,
    },
  ],
  address: {
    addressId: String,
    address: String,
    city: String,
    phone: String,
    pinCode: String,
    note: String,
  },
  orderStatus: String,
  paymentMethod: String,
  paymentStatus: String,
  totalAmount: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  paymentId: String,
  payerId: String,
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
