const { Order, ProductCart } = require("../models/order");

// middleware
exports.getOrderById = (req, res, next, id) => {
  Order.findById(id)
    .populate("products.product", "name price")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "No ordre found in DB",
        });
      }
      req.order = order;
      next();
    });
};

// controllers
exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, order) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to create the order",
      });
    }
    return res.json({ order });
  });
};

exports.getAllOrders = (req, res) => {
  Order.find()
    .populate("user", "_id name")
    .exec((err, order) => {
      if (err) {
        return res.status(400).json({
          error: "Unable to get orders.",
        });
      }
      return res.json(order);
    });
};

exports.getOrderStatus = (req, res) => {
  res.json(order.schema.path)("status").enumValues();
};

exports.updateStatus = (req, res) => {
  Order.update(
    { _id: req.body.orderId },
    { $set: { status: req.body.status } },
    (err, ordre) => {
      if (err) {
        return (
          res.status(400),
          json({
            error: "Cannot update order",
          })
        );
      }
      return res.json(order);
    }
  );
};
