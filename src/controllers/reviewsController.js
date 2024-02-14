const Reviews = require("../models/Reviews");

//get-all-the-reviews-done-by-a-specific-user
exports.getReviewByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const reviews = await Reviews.find({ userId: userId });
    res.status(201).send(reviews);
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
