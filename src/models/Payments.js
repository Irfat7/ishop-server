const mongoose = require("mongoose");
const refs = require("../constants/refs");
const { checkUserIdExists } = require("../utils/userUtils");

const paymentsSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: refs.Users,
  },
});

paymentsSchema.pre("save", async function (next) {
  try {
    const userExists = await checkUserIdExists(this.userId);
    if (!userExists) {
      throw new Error("User does not exist");
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model(refs.Payments, paymentsSchema);
