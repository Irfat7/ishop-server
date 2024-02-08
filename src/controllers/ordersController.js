const Orders = require("../models/Orders");

//create-a-new-order
exports.createAnOrder = async (req, res) => {
  try {
    const { userId, paymentId, productId, quantity } = req.body;
    if (
      !Array.isArray(productId) ||
      !Array.isArray(quantity) ||
      productId.length !== quantity.length ||
      productId.length === 0
    ) {
      return res
        .status(400)
        .send({ error: true, message: "Invalid Order Items" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newOrder = await new Orders({
      userId,
      paymentId,
      productId,
      quantity,
      otp,
      status: "Ordered",
    });
    await newOrder.save();

    res.status(201).send(newOrder);
  } catch (error) {
    if (
      error.name === "ValidationError" ||
      error.name === "CastError" ||
      error.name === "Error"
    ) {
      return res.status(400).send({
        error: true,
        message: error.name === "Error" ? error.message : "Invalid Order Info",
      });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};
