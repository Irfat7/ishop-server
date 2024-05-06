const mongoose = require("mongoose");
const refs = require("../constants/refs");

const cartsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Users,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Products,
  },
  quantity: Number,
});

cartsSchema.pre("save", async function (next) {
  try {
    const Users = require("../models/Users");
    const Products = require("../models/Products");

    const userExists = await Users.findById(this.userId);
    const productExists = await Products.findById(this.productId);

    if (!userExists || !productExists) {
      throw new Error("User or Product does not exists");
    } else if (productExists.quantity <= this.quantity) {
      throw new Error("Out of stock");
    }

    next();
  } catch (error) {
    next(error);
  }
});

cartsSchema.statics.bulkUpdateCarts = async function (updateArray) {
  const session = await this.startSession();
  session.startTransaction();

  try {
    const Products = require("../models/Products");
    
    for (const { pId, quantity } of updateArray) {
      const product = await Products.findById(pId);
      if (!product) {
        throw new Error(`Product with ID ${pId} not found`);
      }

      if (product.quantity < quantity) {
        throw new Error(`Not enough product named ${product.name}`);
      }
    }

    for (const { _id, quantity } of updateArray) {
      await this.updateOne({ _id }, { $set: { quantity } }, { session });
    }
    await session.commitTransaction();
    session.endSession();
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

module.exports = mongoose.model(refs.Carts, cartsSchema);
