const Category = require("../models/category");
const Item = require("../models/item");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.category_list = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}).sort({ name: 1 }).exec();

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

exports.category_delete_post = [
  body("password").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const [category, items] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Item.find({ category: req.params.id }, "name").exec(),
    ]);

    const passwordInput = req.body.password;

    if (items.length > 1 || passwordInput !== process.env.PASSWORD) {
      res.render("category_delete", {
        title: "Delete",
        category: category,
        items: items,
        error: "yes",
      });
      return;
    } else {
      await Category.findByIdAndDelete(req.body.categoryid);
      res.redirect("/");
    }
  }),
];

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_create", {
    title: "Update",
    category: category,
  });
});

exports.category_update_post = [
  body("name").trim().isLength({ min: 3 }).escape(),
  body("description").trim().isLength({ min: 10 }).escape(),
  body("password").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const passwordInput = req.body.password;

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    });

    if (!errors.isEmpty() || passwordInput !== process.env.PASSWORD) {
      res.render("category_create", {
        title: "Update",
        category: category,
        errors: errors.array(),
        error: "yes",
      });
      return;
    } else {
      const updateCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category
      );
      res.redirect(updateCategory.url);
    }
  }),
];
