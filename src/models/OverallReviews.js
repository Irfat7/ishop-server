const { default: mongoose } = require("mongoose");
const refs = require("../constants/refs");
const Users = require("./Users");

const overallReviewsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Users,
    required: [true, "userId required"],
  },
  starCount: {
    type: Number,
    required: [true, "star count is required"],
    min: 1,
    max: 5,
  },
  message: {
    type: String,
    minLength: [20, "Minimum length of 20"],
    maxLength: [200, "Maximum length of 200"],
  },
});

overallReviewsSchema.pre("save", async function (next) {
  try {
    const userExist = await Users.findById(this.userId);
    if (!userExist) {
      throw new Error("User does not exist");
    } else if (userExist.reviewDone.length < 3) {
      throw new Error(
        "Minimum of three products review need to be done to perform this"
      );
    }
    const OverallReviews = this.constructor;
    const alreadyReviewed = await OverallReviews.findOne({
      userId: this.userId,
    });

    if (alreadyReviewed) {
      throw new Error("You already reviewed our service! Thank you");
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model(refs.OverallReviews, overallReviewsSchema);
