const mongoose = require("mongoose");
const refs = require("../constants/refs");
const Categories = require("../models/Categories");

const productsSchema = mongoose.Schema({
  name: String,
  description: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Categories,
  },
  imageUrl: [String],
  quantity: Number,
  createdAt: Date,
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
      throw new Error("CategoryNotExist");
    }

    const alreadyContains = categoryExists.products.includes(this._id);

    if (!alreadyContains) {
      category.products.push(this._id);
      await category.save();
    }

    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model(refs.Products, productsSchema);
