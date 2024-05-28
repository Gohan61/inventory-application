const Item = require("../models/item");
const Category = require("../models/category");
const asyncHandler = require("express-async-handler");
const category = require("../models/category");
const { body, validationResult } = require("express-validator");

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

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect("/category/" + item.category.toString());
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find({}, "name")
    .sort({ name: 1 })
    .exec();

  res.render("item_create", {
    title: "Create new item",
    categories: allCategories,
  });
});

exports.item_create_post = [
  body("name", "Item name must not be empty and have at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body(
    "description",
    "Item description must not be empty and have at least 10 characters"
  )
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body("category", "Category selection is required").trim().escape(),
  body("price", "Price must not be empty").trim().isFloat().escape(),
  body("numberInStock", "Number in stock must not be empty")
    .trim()
    .isInt()
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      numberInStock: req.body.numberInStock,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find({}, "name")
        .sort({ name: 1 })
        .exec();

      res.render("item_create", {
        title: "Create new item",
        categories: allCategories,
        errors: errors.array(),
        item: item,
      });
      return;
    } else {
      await item.save();
      res.redirect("/category" + item.url);
    }
  }),
];
