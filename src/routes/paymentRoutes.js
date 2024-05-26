const express = require("express");
const {
  createPaymentIntent,
  createNewPayment,
} = require("../controllers/paymentControllers");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/create-payment-intent", authenticateToken, createPaymentIntent);
router.post("/payment/new-payment", authenticateToken, createNewPayment);

module.exports = router;
