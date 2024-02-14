const mongoose = require("mongoose");
const refs = require("../constants/refs");
const Categories = require("../models/Categories");

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
      throw new Error("CategoryNotExist");
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

module.exports = mongoose.model(refs.Products, productsSchema);
