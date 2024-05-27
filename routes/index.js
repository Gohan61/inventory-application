const express = require("express");
const router = express.Router();

const category_controller = require("../controllers/categoryController");

/* GET home page. */
router.get("/", category_controller.category_list);

router.get("/create", category_controller.category_create_get);
router.post("/create", category_controller.category_create_post);

module.exports = router;
