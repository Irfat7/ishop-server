const mongoose = require("mongoose");
const refs = require("../constants/refs");

const productsSchema = mongoose.Schema({
  name: String,
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Categories
  },
  imageUrl: [String],
  quantity: Number,
  createdAt: Date,
});

module.exports = mongoose.model(refs.Products, productsSchema)
