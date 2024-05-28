const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const category = require("../models/category");

exports.index = asyncHandler(async (req, res, next) => {
  const items = await Item.find({ category: req.params.id }).exec();
  const category = await Category.findById(req.params.id).exec();

  res.render("category", {
    itemList: items,
    title: category.name,
    category: category,
  });
});

exports.item_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  const category = await Category.findById(item.category.toString(), "name");

  res.render("item.pug", {
    title: item.name,
    item: item,
    categoryID: item.category.toString(),
    category: category,
  });
});

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  if (item === null) {
    res.redirect("/category/" + item.category.toString());
  }

  res.render("item_delete", {
    title: "Delete",
    item: item,
    category_name: item.category.toString(),
  });
});
