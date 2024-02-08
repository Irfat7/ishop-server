const Orders = require("../models/Orders");
const Carts = require("../models/Carts")

//create-a-new-order
exports.createAnOrder = async (req, res) => {
  try {
    const { userId, paymentId, productId, quantity, carts } = req.body;
    if (
      !Array.isArray(productId) ||
      !Array.isArray(quantity) ||
      productId.length !== quantity.length ||
      productId.length === 0 ||
      new Set(productId).size !== productId.length
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

    //clear carts
    if(Array.isArray(carts)){
      await Carts.deleteMany({ _id: { $in: carts } });
    }

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
