const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");

router.post("/orders", ordersController.createAnOrder);

module.exports = router;
