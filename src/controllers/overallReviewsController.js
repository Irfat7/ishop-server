const OverallReviews = require("../models/OverallReviews");

//create new review
exports.createNewOverallReview = async (req, res) => {
  const { userId, message, starCount } = req.body;
  try {
    const newReview = new OverallReviews({ userId, message, starCount });
    await newReview.save();
    res.status(200).send(newReview);
  } catch (error) {
    console.log(error.message);
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

//get first four review
exports.getReview = async (req, res) => {
  try {
    const reviews = await OverallReviews.find({ starCount: 5 })
      .populate("userId")
      .sort({ starCount: -1 })
      .limit(4);
    res.status(200).send(reviews);
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
};
