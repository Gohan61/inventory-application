const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}, "name").sort({ name: 1 }).exec();

  res.render("index", { title: "Keyboard store", category_list: categories });
});

exports.category_create_get = (req, res, next) => {
  res.render("category_create", { title: "Create category" });
};

exports.category_create_post = [
  body("name", "Category must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body(
    "description",
    "Category description must contain at least 10 characters"
  )
    .trim()
    .isLength({ min: 10 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    });

    if (!errors.isEmpty()) {
      res.render("category_create", {
        title: "Create category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (categoryExists) {
        res.redirect(categoryExists.url);
      } else {
        await category.save();

        res.redirect(category.url);
      }
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name").exec(),
  ]);

  if (category === null) {
    res.redirect("/");
  }

  res.render("category_delete", {
    title: "Delete",
    category: category,
    items: items,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, items] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Item.find({ category: req.params.id }, "name").exec(),
  ]);

  if (items.length > 1) {
    res.render("category_delete", {
      title: "Delete",
      category: category,
      items: items,
    });
    return;
  } else {
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/");
  }
});
