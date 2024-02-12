const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");

router.post("/orders", ordersController.createAnOrder);
router.patch("/orders/:orderId", ordersController.updateOrderStatus);

module.exports = router;