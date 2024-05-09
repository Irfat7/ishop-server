const express = require("express");
const { createPaymentIntent, hello } = require("../controllers/paymentControllers");
const router = express.Router();

router.post("/create-payment-intent", createPaymentIntent);

module.exports = router;
