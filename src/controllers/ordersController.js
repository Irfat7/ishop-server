const Orders = require("../models/Orders");

//create-a-new-order
exports.createAnOrder = async (req, res) => {
  try {
    const { userId, paymentId, productId, quantity } = req.body;
    if (!Array.isArray(productId, quantity)) {
      return res
        .status(400)
        .send({ error: true, false: "Invalid Order Items" });
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
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res
        .status(400)
        .send({ error: true, message: "Invalid Order Info" });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};
