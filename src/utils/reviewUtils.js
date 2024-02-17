const Reviews = require("../models/Reviews");
const Users = require("../models/Users");
const Products = require("../models/Products");

const updateUserReviewList = async (userId, reviewId) => {
  const user = await Users.findById(userId);
  if (user) {
    if (!user.reviewDone.includes(reviewId)) {
      user.reviewDone.push(reviewId);
      await user.save();
    }
  }
  return true;
};

module.exports = {
  updateUserReviewList,
};
