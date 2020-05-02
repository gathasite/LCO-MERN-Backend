const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const Product = require("../models/product");
const User = require("../models/user");

// Product cart schema
const ProductCartSchema = new mongoose.Schema({
  product: {
    type: ObjectId,
    ref: Product,
  },
  name: String,
  count: Number,
  price: Number,
});

const ProductCart = mongoose.model("ProductCart", ProductCartSchema);

// Order schema
const OrderSchema = new mongoose.Schema(
  {
    product: [ProductCartSchema],
    transaction_id: {},
    amount: { type: Number },
    address: String,
    status: {
      type: String,
      default: "Recieved",
      enum: ["Cancelled", "Delivered", "Shipped", "InProcess", "Recieved"],
    },
    updated: Date,
    user: {
      type: ObjectId,
      ref: User,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

module.exports = { ProductCart, Order };
