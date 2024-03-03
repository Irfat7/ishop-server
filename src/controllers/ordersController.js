const Orders = require("../models/Orders");
const Carts = require("../models/Carts");
const { ObjectId } = require("mongodb");

//create-a-new-order
exports.createAnOrder = async (req, res) => {
  try {
    const { userId, paymentId, productInfo, carts } = req.body;

    if (!userId || !paymentId || !productInfo) {
      return res
        .status(400)
        .send({ error: true, message: "Order related info missing" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newOrder = await new Orders({
      userId,
      paymentId,
      productInfo,
      otp,
      status: "Ordered",
    });
    await newOrder.save();

    //clear-carts
    if (Array.isArray(carts)) {
      await Carts.deleteMany({ _id: { $in: carts } });
    }

    res.status(200).send(newOrder);
  } catch (error) {
    console.log(error.message);
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

//update-order-status
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { otp } = req.body;

    if (!orderId || !otp) {
      return res.status(400).send({
        error: true,
        message: "Missing order id or otp",
      });
    }

    const order = await Orders.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).send({
        error: true,
        message: "Order does not exist",
      });
    }

    if (order.otp != otp) {
      return res.status(401).send({ error: true, message: "Wrong otp" });
    }

    const result = await Orders.updateOne(
      { _id: orderId },
      { status: "delivered" }
    );

    res.status(200).send(result); //data.acknowledged = true - frontend
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send({
        error: true,
        message: "Invalid id",
      });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

//get-all-order-for-a-user
exports.getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Orders.find({ userId: userId, status: "delivered" });
    res.send(orders);
  } catch (error) {
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};

//get-not-reviewed-order
exports.getNotReviewedOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const notReviewedOrders = await Orders.aggregate([
      { $unwind: "$productInfo" },
      {
        $match: {
          $and: [
            { userId: new ObjectId(userId) },
            { "productInfo.reviewed": false },
            { status: "delivered" },
          ],
        },
      },
      {
        $project: {
          paymentId: 0,
          otp: 0,
          status: 0,
        },
      },
    ]);

    res.status(200).send(notReviewedOrders);
  } catch (error) {
    if (error.name === "BSONError") {
      return res.status(400).send({
        error: true,
        message: "Invalid order id",
      });
    }
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
};
