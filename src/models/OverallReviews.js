const { default: mongoose } = require("mongoose");
const refs = require("../constants/refs");
const { checkUserIdExists } = require("../utils/userUtils");

const overallReviewsSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Users,
    required: [true, "userId required"],
  },
  message: {
    type: String,
    minLength: [20, "Minimum length of 20"],
    maxLength: [200, "Maximum length of 200"],
  },
});

overallReviewsSchema.pre("save", async function (next) {
  try {
    const userExist = await checkUserIdExists(this.userId);
    if (!userExist) {
      throw new Error("User does not exist");
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model(refs.OverallReviews, overallReviewsSchema);
