const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

// middleware
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product not found.",
        });
      }
      req.product = product;
      next();
    });
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
};

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  // bulk write
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk operation failed to update stock",
      });
    }
  });
};

// controllers
exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true; // keep file extensions

  form.parse(req, (err, fields, file) => {
    // parse request
    if (err) {
      return res.status(400).json({
        error: "Invalid image file.",
      });
    }
    //destructure the fields
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Some fields are missing.",
      });
    }

    let product = new Product(fields);

    // handle file here
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is larger than expected.",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    // save to DB
    product.save((err, product) => {
      if (err) {
        return (
          res.status(400).json *
          {
            error: "Saving tshirt in DB failed.",
          }
        );
      }
      return res.json({ product });
    });
  });
};

exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

exports.deleteProduct = (req, res) => {
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: `Failed to delete the product ${deletedProduct.name}`,
      });
    }
    res.json({
      message: `Successfully deleted the product ${deletedProduct.name}`,
      deletedProduct,
    });
  });
};

exports.updateProduct = (req, res) => {
  // let form = new formidable.IncomingForm();
  const form = formidable({ keepExtensions: true });
  // form.keepExtensions = true; // keep file extensions
  form.parse(req, (err, fields, files) => {
    // parse request
    if (err) {
      return res.status(400).json({
        error: "Invalid image file.",
      });
    }

    // updation code using lodash
    let product = req.product;
    product = _.extend(product, fields);
    console.log("product: " + product);
    // handle file here
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is larger than expected.",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }
    // save to DB
    product.save((err, product) => {
      if (err) {
        return (
          res.status(400).json *
          {
            error: `Failed to update the product ${product.name}`,
          }
        );
      }
      return res.json({ product });
    });
  });
};

exports.getAllProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8; // beacuse the browers takes in as string
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]]) // key , order
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "Oops!! Nothing found.",
        });
      }
      return res.json(products);
    });
};

exports.getAllUniqueCategories = (req, res) => {
  Product.distinct("category", {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No categories found",
      });
    }
    return res.json(category);
  });
};
