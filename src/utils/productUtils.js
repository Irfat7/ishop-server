const Products = require("../models/Products");

const checkProductIdExists = async (productId) => {
  const product = await Products.findById(productId);
  return product;
};

const updateProductReviewList = async (
  productId,
  reviewId,
  newReviewRating = 0
) => {
  const product = await Products.findById(productId);
  if (product) {
    if (!product.reviews.includes(reviewId)) {
      const averageRating = calculateNewAverage(
        product.averageRating,
        product.reviews.length,
        newReviewRating
      );
      product.averageRating = averageRating;
      product.reviews.push(reviewId);
      await product.save();
    }
  }
  return true;
};

const calculateNewAverage = (avgRating, totalReviews, newReviewRating) => {
  const existingTotalRating = avgRating * totalReviews;
  const newTotalRating = existingTotalRating + newReviewRating;
  const updatedTotalReviews = totalReviews + 1;
  const newAvgRating = newTotalRating / updatedTotalReviews;
  return newAvgRating.toFixed(1);
};

module.exports = {
  checkProductIdExists,
  updateProductReviewList,
};
