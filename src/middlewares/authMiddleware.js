const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res
      .status(401)
      .send({ error: true, message: "unauthorized access" });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
    if (err) {
      return res.status(403).send({ error: true, message: "no access" });
    }
    req.user = user;

    next();
  });
};

export { authenticateToken };
