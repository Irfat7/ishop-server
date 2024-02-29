const mongoose = require("mongoose");
const refs = require("../constants/refs");
const { checkProductIdExists } = require("../utils/productUtils");

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
    /* validate: {
      validator: function (products) {
        return products.length >= 20;
      },
      message: "Sale event must have at least 20 products",
    }, */
  },
});

saleEventsSchema.pre("save", async function (next) {
  try {
    for (const productId of this.products) {
      const validProduct = await checkProductIdExists(productId);
      if (!validProduct) {
        throw new Error(
          "Some of the added product is invalid, Event creation failed"
        );
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model(refs.SaleEvents, saleEventsSchema);
