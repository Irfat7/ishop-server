const mongoose = require("mongoose");
const refs = require("../constants/refs");
const { checkProductIdExists } = require("../utils/productUtils");
const Products = require("../models/Products");

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
  mainDiscount: {
    type: Number,
    default: 0,
    min: 5,
    max: 30,
    required: true,
  },
  discountForCheapProducts: {
    type: Number,
    default: 0,
    min: 5,
    max: 25,
    required: true,
  },
});

saleEventsSchema.pre("save", async function (next) {
  try {
    const SaleEvents = this.constructor;
    const ongoingEvent = await SaleEvents.countDocuments();
    if (ongoingEvent) {
      throw new Error(
        "Already event ongoing. Please delete the previous one to start another event."
      );
    }
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

saleEventsSchema.post("save", async function (doc, next) {
  try {
    await Products.updateMany(
      {
        _id: { $in: doc.products },
      },
      [
        {
          $set: {
            discount: {
              $cond: {
                if: { $lt: ["$price", 1001] },
                then: doc.discountForCheapProducts,
                else: doc.mainDiscount,
              },
            },
          },
        },
      ]
    );
    next();
  } catch (error) {
    next(error);
  }
});

saleEventsSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    doc || next();
    await Products.updateMany(
      {
        _id: { $in: doc.products },
      },
      {
        discount: 0,
      }
    );
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model(refs.SaleEvents, saleEventsSchema);
