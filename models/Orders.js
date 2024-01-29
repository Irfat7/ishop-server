const mongoose = require("mongoose");
const refs = require("../constants/refs");

const ordersSchema = mongoose.Schema({
  productId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: refs.Products,
    },
  ],
  quantity: [Number],
  otpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.OTPs,
  },
  status: Boolean,
});

module.exports = mongoose.model(refs.Orders, ordersSchema);
