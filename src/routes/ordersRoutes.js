const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");
const {
  authenticateToken,
  verifyAdmin,
} = require("../middlewares/authMiddleware");

router.post("/orders", authenticateToken, ordersController.createAnOrder);
router.patch(
  "/orders/:orderId",
  authenticateToken,
  verifyAdmin,
  ordersController.updateOrderStatus
);
router.get(
  "/orders/all/:userId",
  authenticateToken,
  ordersController.getOrdersByUserId
);
router.get(
  "/orders/get-all",
  authenticateToken,
  verifyAdmin,
  ordersController.getAllOrders
);
router.get(
  "/orders/get/last-digit",
  authenticateToken,
  verifyAdmin,
  ordersController.getOrdersByLastDigit
);
router.get(
  "/orders/not-reviewed/:userId",
  authenticateToken,
  ordersController.getNotReviewedOrders
);
router.get("/orders/most-popular", ordersController.getMostPopularProducts);

module.exports = router;
