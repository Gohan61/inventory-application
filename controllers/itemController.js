const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const items = await Item.find({ category: req.params.id }).exec();
  const category = await Category.findById(req.params.id).exec();

  res.render("category", {
    itemList: items,
    title: category.name,
  });
});
