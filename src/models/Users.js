const mongoose = require("mongoose");
const refs = require("../constants/refs");

const usersSchema = new mongoose.Schema({
  firebaseId: {
    type: String,
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin", "deliverer"],
    default: "user",
    lowercase: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  reviewDone: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: refs.Reviews,
      required: true,
    },
  ],
});

module.exports = mongoose.model(refs.Users, usersSchema);
