const mongoose = require("mongoose");
const refs = require("../constants/refs");

const categoriesSchema = mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: refs.Products,
    },
  ],
});

module.exports = mongoose.model(refs.Categories, categoriesSchema);
