const express = require("express");
const router = express.Router();

// controllers
const {
  createOrder,
  getAllOrders,
  updateStatus,
  getOrderStatus,
} = require("../controllers/order");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const {
  getUserById,
  pushOredrsInPurchaseList,
} = require("../controllers/user");
const { updateStock, getProductById } = require("../controllers/product");

const {} = require("../models/order");

// params
router.param("userId", getUserById);
router.param("productId", getProductById);

// actual routes
// create
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOredrsInPurchaseList, // add selected purchased list
  updateStock, // update the stock
  createOrder // place order
);

// read
router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

// order status
router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);

// update
router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
