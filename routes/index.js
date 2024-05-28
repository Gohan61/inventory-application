const express = require("express");
const router = express.Router();

const category_controller = require("../controllers/categoryController");

/* GET home page. */
router.get("/", category_controller.category_list);

router.get("/create", category_controller.category_create_get);
router.post("/create", category_controller.category_create_post);

router.get("/category/:id/delete", category_controller.category_delete_get);
router.post("/category/:id/delete", category_controller.category_delete_post);

router.get("/category/:id/update", category_controller.category_update_get);
router.post("/category/:id/update", category_controller.category_update_post);

module.exports = router;
