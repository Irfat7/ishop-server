const Coupons = require("../models/Coupons");

//create a new coupon
exports.addNewCoupon = async (req, res) => {
  try {
    const { code, quantity, amount } = req.body;
    const newCoupon = await new Coupons({
      code,
      quantity,
      amount,
    });
    await newCoupon.save();
    res.status(201).send(newCoupon);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "Error") {
      return res.status(400).send({
        error: true,
        message: error.message,
      });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};
