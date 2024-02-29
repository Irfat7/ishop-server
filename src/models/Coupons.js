const mongoose = require("mongoose");
const refs = require("../constants/refs");

const couponsSchema = mongoose.Schema({
  name: {
    type: String,
    maxLength: 12,
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

module.exports = mongoose.model(refs.Coupons, couponsSchema);
