const mongoose = require("mongoose");
const refs = require("../constants/refs");

const couponsSchema = mongoose.Schema({
  code: {
    type: String,
    lowerCase: true,
    minLength: 8,
    maxLength: 18,
    required: true,
  },
  quantity: {
    type: Number,
    min: 10,
    max: 100,
    required: true,
  },
  amount: {
    type: Number,
    min: 10,
    max: 500,
    required: true,
  },
});

couponsSchema.pre("save", async function (next) {
  try {
    const Coupons = this.constructor;
    const codeExists = await Coupons.find({ code: this.code });
    if (codeExists) {
      throw new Error("Coupon with same code already exists");
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model(refs.Coupons, couponsSchema);
