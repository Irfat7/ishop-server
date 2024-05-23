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
    res.status(200).send(newCoupon);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "Error") {
      return res.status(400).send({
        error: error.message,
      });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};

//update a coupon
exports.updateExistingCoupon = async (req, res) => {
  try {
    const couponId = req.params.couponId;
    const updatedCoupon = await Coupons.findOneAndUpdate(
      {
        _id: couponId,
      },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCoupon) {
      return res.status(404).send({ error: "Coupon doesn't exist" });
    }
    res.status(200).send(updatedCoupon);
  } catch (error) {
    console.log(error.message);
    if (error.name === "CastError" || error.name === "ValidationError") {
      return res.status(400).send({ error: "Invalid Coupon Information" });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};

//delete existing coupon
exports.deleteCoupon = async (req, res) => {
  try {
    const couponId = req.params.couponId;
    const deletedCoupon = await Coupons.findOneAndDelete({ _id: couponId });
    if (!deletedCoupon) {
      return res.status(404).send({
        error: "Coupon already deleted or doesn't exist",
      });
    }
    res.status(200).send(deletedCoupon);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send({
        error: "Invalid coupon id",
      });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};

//get a coupon
exports.getExistingCoupon = async (req, res) => {
  try {
    const coupons = await Coupons.find();
    res.status(200).send(coupons);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

//get coupon by code
exports.getCouponByCode = async (req, res) => {
  try {
    const couponCode = req.params.couponCode;
    const coupon = await Coupons.findOne({
      code: couponCode,
      quantity: { $gt: 0 },
    });

    if (!coupon) {
      return res.status(404).send({ error: "Coupon does not exist" });
    }

    res.status(200).send(coupon);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

//reduce coupon
exports.reduceCouponQuantity = async (req, res) => {
  try {
    const couponCode = req.params.couponCode;
    const updatedCoupon = await Coupons.reduceQuantityByOne(couponCode);
    res.status(200).send(updatedCoupon);
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: error.message });
  }
};
