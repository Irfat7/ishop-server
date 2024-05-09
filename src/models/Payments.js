const mongoose = require("mongoose");
const refs = require("../constants/refs");

const paymentsSchema = mongoose.Schema({
  amount: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Users,
  },
});

module.exports = mongoose.model(refs.Payments, paymentsSchema);