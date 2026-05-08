import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

// GET PRODUCTS
router.get("/", async (req, res) => {
  const products = await Product.find();

  res.json(products);
});

// ADD PRODUCT
router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);

  await newProduct.save();

  res.json(newProduct);
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  await Product.findByIdAndDelete(
    req.params.id
  );

  res.json({
    message: "Product deleted"
  });
});

// UPDATE PRODUCT
router.put("/:id", async (req, res) => {
  const updatedProduct =
    await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true
      }
    );

  res.json(updatedProduct);
});

export default router;