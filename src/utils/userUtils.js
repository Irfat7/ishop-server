const Users = require("../models/Users");

exports.checkUserIdExists = async (userId) => {
  const user = await Users.findById(userId);
  return user !== null;
};
