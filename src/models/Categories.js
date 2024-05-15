const mongoose = require("mongoose");
const refs = require("../constants/refs");

const categoriesSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
  },
  imageUrl:{
    type: String,
    required: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: refs.Products,
    },
  ],
});

module.exports = mongoose.model(refs.Categories, categoriesSchema);
