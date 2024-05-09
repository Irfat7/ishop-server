const Payments = require("../models/Payments");

require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_KEY);

//create a new payment
exports.createNewPayment = async (req, res) => {
  try {
    const { amount, userId } = req.body;
    const newPayment = new Payments({ amount, userId });
    await newPayment.save();

    res.status(200).send(newPayment);
  } catch (error) {
    if (
      error.name === "ValidationError" ||
      error.name === "CastError" ||
      error.name === "BSONError" ||
      error.name === "Error"
    ) {
      return res
        .status(400)
        .send({
          error:
            error.name === "Error"
              ? error.message
              : "Invalid Payment Info Passed",
        });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};

//payment intent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { totalPrice, carts } = req.body;

    if (!totalPrice || !carts) {
      return res.status(400).send({ error: "Invalid Price" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalPrice * 100,
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
    res.send({ error: "Something Went Wrong" });
  }
};
