const { ObjectId } = require("mongodb");
const Carts = require("../models/Carts");

//add-a-new-cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res
        .status(400)
        .send({ error: true, message: "Cart information missing" });
    }

    let cart = await Carts.findOne({ userId, productId });

    if (!cart) {
      cart = new Carts({ userId, productId, quantity });
    } else {
      cart.quantity += quantity;
    }

    await cart.save();
    res.status(201).send(cart);
  } catch (error) {
    console.log(error.name);
    if (error.name === "ValidationError" || error.name === "CastError" || error.name === "Error") {
      return res
        .status(400)
        .send({ error: true, message: "Invalid information" });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};
