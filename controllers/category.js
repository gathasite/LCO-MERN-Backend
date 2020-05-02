const Category = require("../models/category");

// middleware
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, cate) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found DB",
      });
    }
    req.category = cate;
    next();
  });
};

// controllers
exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.sattus(400).json({
        error: "NOT able to save category in DB",
      });
    }
    res.json({category});
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategories = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.sattus(400).json({
        error: "No categories found.",
      });
    }
    return res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category; // getting from middleware
  category.name = req.body.name; // getting from request body

  category.save((err, updatedCategory) => {
    if (err) {
      return res.sattus(400).json({
        error: "Failed to update category.",
      });
    }
    return res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;

  category.remove((err, category)=>{
    if (err) {
      return res.sattus(400).json({
        error: `Failed to delete ${category.name} category.`,
      });
    }
    return res.json({
      message: `${category.name} is successfully deleted`
    });

  })
}
