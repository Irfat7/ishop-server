const mongoose = require("mongoose");
const refs = require("../constants/refs");
const Payments = require("../models/Payments");
const Products = require("../models/Products");
const { checkUserIdExists } = require("../utils/userUtils");
const { checkProductIdExists } = require("../utils/productUtils");

const productInfoSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Products, // Reference to the Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  reviewed: {
    type: Boolean,
    default: false, // Default value for reviewed
  },
});

const ordersSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Users,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Payments,
  },
  productInfo: [productInfoSchema],
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

    for (const eachOrder of this.productInfo) {
      const productExists = await checkProductIdExists(eachOrder.productId);
      if (!productExists) {
        throw new Error("Invalid product");
      }
      if (eachOrder.quantity > productExists.quantity) {
        throw new Error(
          `Sorry ${productExists.name} out of stock for quantity ${eachOrder.quantity}`
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

//reduce available quantity after a new order
ordersSchema.post("save", async function () {
  try {
    for (const eachOrder of this.productInfo) {
      const product = await Products.findById(eachOrder.productId);
      if (product) {
        product.quantity -= eachOrder.quantity;
        await product.save();
      }
    }
  } catch (error) {}
});

module.exports = mongoose.model(refs.Orders, ordersSchema);
