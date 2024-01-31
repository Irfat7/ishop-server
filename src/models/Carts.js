const mongoose = require("mongoose");
const refs = require("../constants/refs");

const cartsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Users,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Products,
  },
  quantity: Number,
});

module.exports = mongoose.model(refs.Carts, cartsSchema);
