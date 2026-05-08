import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

// CREATE ORDER
router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);

  await newOrder.save();

  res.json({
    message: "Order placed successfully"
  });
});

// GET ALL ORDERS
router.get("/", async (req, res) => {
  const orders = await Order.find();

  res.json(orders);
});

// DELETE ORDER
router.delete("/:id", async (req, res) => {
  await Order.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message: "Order deleted"
  });
});

export default router;