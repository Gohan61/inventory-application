const express = require("express");
const router = express.Router();

const item_controller = require("../controllers/itemController");

router.get("/item/create", item_controller.item_create_get);
router.post("/item/create", item_controller.item_create_post);

router.get("/item/:id/delete", item_controller.item_delete_get);
router.post("/item/:id/delete", item_controller.item_delete_post);

router.get("/item/:id/update", item_controller.item_update_get);
router.post("/item/:id/update", item_controller.item_update_post);

router.get("/item/:id", item_controller.item_get);
router.get("/:id", item_controller.index);

module.exports = router;
