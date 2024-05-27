const express = require("express");
const router = express.Router();

const item_controller = require("../controllers/itemController");

router.get("/:id", item_controller.index);

module.exports = router;
