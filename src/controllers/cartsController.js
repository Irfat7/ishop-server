const { ObjectId } = require("mongodb");
const Carts = require("../models/Carts");
const { default: mongoose } = require("mongoose");
const { findOneAndDelete } = require("../models/Users");

//add-a-new-cart
exports.addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || !quantity) {
      return res.status(400).send({ error: "Cart information missing" });
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
        .send({ error: error.message || "Invalid information" });
    }
    res.status(500).send({ error: "Internal Server Error" });
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

    const availableCarts = itemsInCart.filter((cart) => {
      const productQuantity = cart.productId.quantity;
      return cart.quantity <= productQuantity;
    });

    const cartsToDelete = itemsInCart.filter((cart) => {
      const productQuantity = cart.productId.quantity;
      return cart.quantity > productQuantity;
    });

    const cartIdsToDelete = cartsToDelete.map((cart) => cart._id);

    await Carts.deleteMany({ _id: { $in: cartIdsToDelete } });

    res.status(200).send(availableCarts);
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
    if (
      error.name === "CastError" ||
      error.name === "ValidationError" ||
      error.name === "BSONError" ||
      error.name === "Error"
    ) {
      return res.status(400).send({
        error: error.name === "Error" ? error.message : "Invalid info passed",
      });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};

//delete product from a users cart
exports.deleteProductFromCart = async (req, res) => {
  try {
    const cartId = req.params.cartId;
    const deletionComplete = await Carts.findOneAndDelete({ _id: cartId });
    if (!deletionComplete) {
      return res
        .status(400)
        .send({ error: "Cart does not exist or already deleted" });
    }
    res.status(200).send(deletionComplete);
  } catch (error) {
    console.log(error.message);
    if (error.name === "CastError") {
      return res.status(400).send({
        error: "Invalid id passed",
      });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};
