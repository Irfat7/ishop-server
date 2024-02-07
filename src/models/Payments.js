const mongoose = require("mongoose");
const refs = require("../constants/refs");

const paymentsSchema = mongoose.Schema({
  amount: Number,
});

module.exports = mongoose.model(refs.Payments, paymentsSchema);