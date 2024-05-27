const express = require("express");
const router = express.Router();

const item_controller = require("../controllers/itemController");

router.get("/:id", item_controller.index);

router.get("/item/:id", item_controller.item_get);

module.exports = router;
