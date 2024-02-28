const mongoose = require("mongoose");
const refs = require("../constants/refs");

const saleEventsSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name of the event can not be empty"],
  },
  products: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: refs.Products,
      },
    ],
    validate: {
      validator: function (products) {
        return products.length >= 20;
      },
      message: "Sale event must have at least 20 products",
    },
  },
});

module.exports = mongoose.model(refs.SaleEvents, saleEventsSchema);