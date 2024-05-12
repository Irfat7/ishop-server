const Reviews = require("../models/Reviews");

//get-all-the-reviews-done-by-a-specific-user
exports.getReviewByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reviews = await Reviews.find({ userId: userId });
    res.status(200).send(reviews);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send({
        error: true,
        message: "Invalid User Id",
      });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

//get-all-the-reviews-of-a-particular-product
exports.getReviewByProductId = async (req, res) => {
  try {
    const productId = req.params.productId;
    const reviews = await Reviews.find({ productId: productId });
    res.status(200).send(reviews);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send({
        error: true,
        message: "Invalid Product Id",
      });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

//create-a-review
exports.createNewReview = async (req, res) => {
  try {
    const { orderId, userId, productId, starCount, message } = req.body;
    const newReview = await new Reviews({
      orderId,
      userId,
      productId,
      starCount,
      message,
    });
    await newReview.save();

    res.status(200).send(newReview);
  } catch (error) {
    if (
      error.name === "ValidationError" ||
      error.name === "CastError" ||
      error.name === "Error"
    ) {
      return res.status(400).send({
        error: true,
        message:
          error.name === "Error" ? error.message : "Invalid review item(s)",
      });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};
