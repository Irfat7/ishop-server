const Orders = require("../models/Orders");

const updateReviewStatus = async (orderId, productId) => {
  const updatedOrder = await Orders.findOneAndUpdate(
    {
      _id: orderId,
      "productInfo.productId": productId,
    },
    {
      $set: { "productInfo.$.reviewed": true },
    },
    { new: true }
  );
  return updatedOrder;
};

module.exports = { updateReviewStatus };
