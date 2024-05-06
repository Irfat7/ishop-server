const { ObjectId } = require("mongodb");
const Carts = require("../models/Carts");
const { default: mongoose } = require("mongoose");

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
    res.status(200).send(cart);
  } catch (error) {
    if (
      error.name === "ValidationError" ||
      error.name === "CastError" ||
      error.name === "Error"
    ) {
      return res
        .status(400)
        .send({ error: true, message: error.message || "Invalid information" });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

//get cart of a user
exports.getCartOfUser = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) {
      return res.status(400).send({ error: "UserId missing" });
    }
    const itemsInCart = await Carts.find({ userId: userId })
      .populate({
        path: "productId",
        populate: { path: "category" },
      })
      .exec();

    res.status(200).send(itemsInCart);
  } catch (error) {
    if (error.name === "CastError" || error.name === "BSONError") {
      return res.status(400).send({ error: "Invalid UserId" });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};

//update cart of a user
exports.updateCarts = async (req, res) => {
  try {
    const { updateArray } = req.body;
    if (
      !updateArray ||
      !Array.isArray(updateArray) ||
      updateArray.length === 0
    ) {
      return res.status(400).send({ error: "Update info not passed" });
    }

    await Carts.bulkUpdateCarts(updateArray);

    res.status(200).send({ message: "Bulk update completed successfully" });
  } catch (error) {
    console.log(error.message);
    if (
      error.name === "CastError" ||
      error.name === "ValidationError" ||
      error.name === "BsonError" ||
      error.name === "Error"
    ) {
      return res
        .status(400)
        .send({
          error: error.name === "Error" ? error.message : "Invalid info passed",
        });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};
