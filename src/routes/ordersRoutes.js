const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");

router.post("/orders", ordersController.createAnOrder);
router.patch("/orders/:orderId", ordersController.updateOrderStatus);
router.get("/orders/all/:userId", ordersController.getOrdersByUserId);
router.get("/orders/not-reviewed/:userId", ordersController.getNotReviewedOrders);

module.exports = router;