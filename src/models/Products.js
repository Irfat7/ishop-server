const mongoose = require("mongoose");
const refs = require("../constants/refs");
const Categories = require("../models/Categories");
const Carts = require("../models/Carts");

/* const discountDetails = {
  discountPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 50,
  },
  maxAmount: {
    type: Number,
    validate: {
      validator: function (value) {
        return value < this.price;
      },
      message: "Max discount amount must be less than the price of the product",
    },
  },
}; */

const productsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Categories,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 30,
    validate: {
      validator: function (amount) {
        if (amount === 30) {
          return this.price > 1000;
        }
        return true;
      },
      message:
        "For 30% discount the minimum price of the product should be 1000",
    },
  },
  imageUrl: {
    type: [String],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
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
    if (this.category !== this.prevCategory) {
      const categoryExists = await Categories.findById(this.category);

      if (!categoryExists) {
        throw new Error("Category does not exist");
      }

      const alreadyContains = categoryExists.products.includes(this._id);

      if (!alreadyContains) {
        categoryExists.products.push(this._id);
        await categoryExists.save();
      }

      await Categories.updateOne(
        { _id: this.prevCategory },
        { $pull: { products: { $in: [this._id] } } }
      );
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
