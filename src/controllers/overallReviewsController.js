const OverallReviews = require("../models/OverallReviews");

exports.createNewOverallReview = async (req, res) => {
  const { userId, message } = req.body;
  try {
    const newReview = new OverallReviews({ userId, message });
    await newReview.save();
    res.status(200).send(newReview);
  } catch (error) {
    const errorMap = {
      BSONError: "Invalid userId passed",
      CastError: "Invalid userId passed",
      ValidationError: "Validation failed",
      Error: error.message,
    };

    const errorMessage = errorMap[error.name];

    if (errorMessage) {
      return res.status(400).send({ error: errorMessage });
    }
    res.status(500).send({ error: "Internal server error" });
  }
};
