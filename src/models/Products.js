const mongoose = require("mongoose");
const refs = require("../constants/refs");
const Categories = require("../models/Categories");
const Carts = require("../models/Carts");

const productsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  features: [String],
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Categories,
  },
  imageUrl: [String],
  quantity: Number,
  createdAt: Date,
  averageRating: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: refs.Reviews,
    },
  ],
});

productsSchema.pre("save", async function (next) {
  try {
    const categoryExists = await Categories.findById(this.category);

    if (!categoryExists) {
      throw new Error("Category does not exist");
    }

    const alreadyContains = categoryExists.products.includes(this._id);

    if (!alreadyContains) {
      categoryExists.products.push(this._id);
      await categoryExists.save();
    }

    next();
  } catch (error) {
    next(error);
  }
});

productsSchema.post("findOneAndDelete", async function (doc, next) {
  try {
    //update the cart table
    await Carts.deleteMany({ productId: doc._id });

    //update the category table
    const updatedCategory = await Categories.findById(doc.category);

    const indexToRemove = updatedCategory.products.indexOf(doc._id);
    if (indexToRemove !== -1) {
      updatedCategory.products.splice(indexToRemove, 1);
    }
    await updatedCategory.save();
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model(refs.Products, productsSchema);
