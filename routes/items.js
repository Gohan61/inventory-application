const express = require("express");
const router = express.Router();

const item_controller = require("../controllers/itemController");

router.get("/:id", item_controller.index);
router.get("/item/:id", item_controller.item_get);

router.get("/item/:id/delete", item_controller.item_delete_get);
router.post("/item/:id/delete", item_controller.item_delete_post);

router.get("item/:id/create", item_controller.item_create_get);
router.post("item/:id/create", item_controller.item_create_post);

module.exports = router;
