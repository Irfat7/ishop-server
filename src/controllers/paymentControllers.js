const Products = require("../models/Products");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
exports.createPaymentIntent = async (req, res) => {
  try {
    const { carts } = req.body;

    if (!carts) {
      return res.status(400).send({ error: "Invalid carts" });
    }
    

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 10000,
      currency: "usd",
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.log(error.message);
    //error-handle
  }
};
