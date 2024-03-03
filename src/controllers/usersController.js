const Users = require("../models/Users");

//get-a-user
exports.getSpecificUser = async (req, res) => {
  try {
    const email = req.params.email;

    if (!email) {
      return res
        .status(400)
        .send({ error: true, message: "Email parameter is required" });
    }

    const user = await Users.findOne({ email: email });

    if (!user) {
      return res.status(404).send({ error: true, message: "User not found" });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

//get-all-users
exports.getAllUsers = async (req, res) => {
  try {
    const results = await Users.find();

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

//create-new-user
exports.createNewUser = async (req, res) => {
  try {
    const { name, email, imageUrl, role } = req.body;

    const emailAlreadyExists = await Users.exists({ email: email });
    if (emailAlreadyExists) {
      return res.send({ emailExists: true });
    }

    const newUser = await Users.create({
      name,
      email,
      imageUrl,
      role,
      createdAt: new Date(),
      reviewDone: [],
    });

    res.status(200).send(newUser);
  } catch (error) {
    console.log(error.name);
    if (error.name === "ValidationError") {
      return res.status(401).send({
        error: true,
        message: "Invalid User Info",
      });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

//change role
exports.changeRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const updatedUser = await Users.findOneAndUpdate(
      { _id: userId },
      { role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ error: true, message: "User not found" });
    }
    
    res.status(200).send(updatedUser);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res
        .status(401)
        .send({ error: true, message: "Invalid User Info" });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};
