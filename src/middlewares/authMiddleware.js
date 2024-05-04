var jwt = require("jsonwebtoken");
const Users = require("../models/Users");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    console.log(authHeader);
    console.log(token);
    return res
      .status(401)
      .send({ error: true, message: "unauthorized access" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).send({ error: true, message: "Forbidden" });
    }
    req.user = user;

    next();
  });
};

const verifyAdmin = async (req, res, next) => {
  const adminExists = await Users.findOne({
    email: req.user.email,
    role: "admin",
  });
  if (!adminExists) {
    return res
      .status(403)
      .send({ error: true, message: "Unauthorized Access" });
  }
  next();
};

module.exports = { authenticateToken, verifyAdmin };
