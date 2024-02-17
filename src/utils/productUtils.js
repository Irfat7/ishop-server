const Products = require("../models/Products");

const checkProductIdExists = async (productId) => {
  const product = await Products.findById(productId);
  return product;
};

const updateProductReviewList = async (productId, reviewId) => {
  const product = await Products.findById(productId);
  if (product) {
    if (!product.reviews.includes(reviewId)) {
      product.reviews.push(reviewId);
      await product.save();
    }
  }
  return true;
};

module.exports = {
  checkProductIdExists,
  updateProductReviewList,
};
