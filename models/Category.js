const { default: mongoose } = require("mongoose");
const refs = require("../constants/refs");

const categorySchema = mongoose.Schema({
  name: String,
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      refs: refs.Products,
    },
  ],
});

module.exports = mongoose.model(refs.Products, categorySchema);
