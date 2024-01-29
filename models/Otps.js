const mongoose = require("mongoose");
const refs = require("../constants/refs");

const otpsSchema = mongoose.Schema({
  code: String,
});

module.exports = mongoose.model(refs.OTPs, otpsSchema);
