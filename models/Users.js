const mongoose = require("mongoose");
const refs = require("../constants/refs");

const usersSchema = new mongoose.Schema({
  name: String,
  email: String,
  imageUrl: String,
  created_at: Date,
  reviewDone: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: refs.Reviews,
    },
  ],
});

module.exports = mongoose.model(refs.Users, usersSchema);
