var jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { user } = req.body;
    if (!user?.email) {
      throw new Error("No user data passed");
    }
    const token = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: "1h" });
    res.status(200).send({ token });
  } catch (error) {
    res.send({ error: true, message: error.message || "Token failed" });
  }
};