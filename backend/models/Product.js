import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String,
  description: String
});

const Product = mongoose.model("Product", productSchema);

export default Product;