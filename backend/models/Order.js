import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  username: String,

  items: Array,

  totalAmount: Number,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Order = mongoose.model(
  "Order",
  orderSchema
);

export default Order;