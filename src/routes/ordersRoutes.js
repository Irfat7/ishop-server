const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");
const {
  authenticateToken,
  verifyAdmin,
} = require("../middlewares/authMiddleware");

router.post("/orders", ordersController.createAnOrder);
router.patch("/orders/:orderId", ordersController.updateOrderStatus);
router.get("/orders/all/:userId", ordersController.getOrdersByUserId);
router.get(
  "/orders/get-all",
  authenticateToken,
  verifyAdmin,
  ordersController.getAllOrders
);
router.get(
  "/orders/get/last-digit",
  /* authenticateToken,
  verifyAdmin, */
  ordersController.getOrdersByLastDigit
);
router.get(
  "/orders/not-reviewed/:userId",
  ordersController.getNotReviewedOrders
);

module.exports = router;
