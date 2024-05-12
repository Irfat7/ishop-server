const mongoose = require("mongoose");
const refs = require("../constants/refs");
const Orders = require("./Orders");
const { checkUserIdExists } = require("../utils/userUtils");
const {
  checkProductIdExists,
  updateProductReviewList,
} = require("../utils/productUtils");
const { updateUserReviewList } = require("../utils/reviewUtils");
const { updateReviewStatus } = require("../utils/orderUtils");

const reviewsSchema = mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Orders,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Users,
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Products,
    required: true,
  },
  starCount: {
    type: Number,
    required: true,
    max: 5,
    min: 1,
  },
});

reviewsSchema.pre("save", async function (next) {
  try {
    const Reviews = this.constructor;
    console.log("orderId:", this.orderId);
    console.log("userId:", this.userId);
    console.log("productId:", this.productId);

    //valid order check
    const validOrder = await Orders.findOne({
      _id: this.orderId,
      userId: this.userId,
      "productInfo.productId": this.productId,
    });
    if (!validOrder) {
      throw new Error("Order does not exist");
    }

    const userExist = await checkUserIdExists(this.userId);
    if (!userExist) {
      throw new Error("User does not exist");
    }

    const productExist = await checkProductIdExists(this.productId);
    if (!productExist) {
      throw new Error("Product does not exist");
    }

    const alreadyReviewed = await Reviews.findOne({
      orderId: this.orderId,
      userId: this.userId,
      productId: this.productId,
    });
    if (alreadyReviewed) {
      console.log("alreadyReviewed");
      await updateUserReviewList(this.userId, alreadyReviewed._id);
      await updateProductReviewList(this.productId, alreadyReviewed._id);
      await updateReviewStatus(this.orderId, this.productId);
      throw new Error("Product already reviewed");
    }

    next();
  } catch (error) {
    next(error);
  }
});

reviewsSchema.post("save", async function (doc, next) {
  try {
    await updateUserReviewList(this.userId, doc._id);
    await updateProductReviewList(this.productId, doc._id, this.starCount);
    await updateReviewStatus(this.orderId, doc.productId);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model(refs.Reviews, reviewsSchema);
