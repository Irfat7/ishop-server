const mongoose = require("mongoose");
const refs = require("../constants/refs");
const Payments = require("../models/Payments");
const { checkUserIdExists } = require("../utils/userUtils");
const { checkProductIdExists } = require("../utils/productUtils");

const ordersSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Users,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Payments,
  },
  productId: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: refs.Products,
    },
  ],
  quantity: [Number],
  otp: String,
  status: {
    type: String,
    lowercase: true,
  },
});

ordersSchema.pre("save", async function (next) {
  try {
    const Orders = this.model(refs.Orders);
    const userExists = await checkUserIdExists(this.userId);
    const paymentExist = await Payments.findOne({ _id: this.paymentId });
    const paymentAlreadyUsed = await Orders.findOne({
      paymentId: this.paymentId,
    });

    if (paymentAlreadyUsed || !paymentExist) {
      throw new Error("Invalid payment id");
    }
    if (!userExists) {
      throw new Error("Invalid user id");
    }

    for (const [index, productId] of this.productId.entries()) {
      const productExists = await checkProductIdExists(productId);
      if (!productExists) {
        throw new Error("Invalid product");
      }
      if (this.quantity[index] > productExists.quantity) {
        throw new Error(`Sorry ${productExists.name} out of stock`);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model(refs.Orders, ordersSchema);
