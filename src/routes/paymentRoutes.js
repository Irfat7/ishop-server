const express = require("express");
const {
  createPaymentIntent,
  createNewPayment,
} = require("../controllers/paymentControllers");
const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);
router.post("/payment/new-payment", createNewPayment);

module.exports = router;
