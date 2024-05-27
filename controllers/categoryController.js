const Category = require("../models/category");
const asyncHandler = require("express-async-handler");

exports.category_list = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}, "name").sort({ name: 1 }).exec();

  res.render("index", { title: "Keyboard store", category_list: categories });
});
