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

//delete existing coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const couponId = req.params.couponId;
    const deletedCoupon = await Coupons.findOneAndDelete({ _id: couponId });
    if (!deletedCoupon) {
      return res.status(404).send({
        error: true,
        message: "Coupon already deleted or doesn't exist",
      });
    }
    res.status(201).send(deletedCoupon);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send({
        error: true,
        message: "Invalid coupon id",
      });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};
