const mongoose = require("mongoose");
const refs = require("../constants/refs");

const reviewsSchema = mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Orders,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Users,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Products,
  },
  starCount: Number,
});

module.exports = mongoose.model(refs.Reviews, reviewsSchema);