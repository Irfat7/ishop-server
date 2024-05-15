const Orders = require("../models/Orders");
const Carts = require("../models/Carts");
const { ObjectId } = require("mongodb");
const { checkUserIdExists } = require("../utils/userUtils");

//create-a-new-order
exports.createAnOrder = async (req, res) => {
  try {
    const { userId, paymentId, productInfo, carts } = req.body;

    if (!userId || !paymentId || !productInfo) {
      return res.status(400).send({ error: "Order related info missing" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const newOrder = await new Orders({
      userId,
      paymentId,
      productInfo,
      otp,
      status: "Ordered",
      address: "1234567890 1234567890 1234567890",
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
        error: error.name === "Error" ? error.message : "Invalid Order Info",
      });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};

//update-order-status
exports.updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { otp } = req.body;

    if (!orderId || !otp) {
      return res.status(400).send({
        error: "Missing order id or otp",
      });
    }

    const order = await Orders.findOne({ _id: orderId });

    if (!order) {
      return res.status(404).send({
        error: "Order does not exist",
      });
    }

    if (order.otp != otp) {
      return res.status(401).send({ error: "Wrong otp" });
    }

    const result = await Orders.updateOne(
      { _id: orderId },
      { status: "delivered" }
    );

    res.status(200).send(result);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send({
        error: "Invalid id",
      });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};

//get-all-order-for-a-user
exports.getOrdersByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userExists = await checkUserIdExists(userId);
    if (!userExists) {
      return res.status(404).send({
        error: "User does not exist",
      });
    }
    const orders = await Orders.aggregate([
      { $match: { userId: new ObjectId(userId) } },
      {
        $lookup: {
          from: "payments",
          localField: "paymentId",
          foreignField: "_id",
          as: "paymentInfo",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productInfo.productId",
          foreignField: "_id",
          as: "productDescription",
        },
      },
      { $unwind: "$paymentInfo" },
      {
        $addFields: {
          orderedFirst: {
            $cond: { if: { $eq: ["$status", "ordered"] }, then: 1, else: 0 },
          },
        },
      },
      {
        $sort: { orderedFirst: -1 },
      },
    ]);
    res.send(orders);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send({ error: "Invalid Id Provided" });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// get all orders for admin
exports.getAllOrders = async (req, res) => {
  try {
    const sortOption = req.query.sortOption || "default";
    const queryMap = {
      ordered: { status: "ordered" },
      delivered: { status: "delivered" },
    };
    const query = queryMap[sortOption] || {};
    const page = parseInt(req.query.page) || 1;
    const pageSize = 3;
    const skipPage = (page - 1) * pageSize;
    /* const orders = await Orders.find(query).skip(skipPage).limit(pageSize); */
    const orders = await Orders.aggregate([
      {
        $match: query,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "customerInfo",
        },
      },
      {
        $unwind: "$customerInfo",
      },
      {
        $project: {
          _id: 1,
          customerName: "$customerInfo.name",
          status: 1,
          productInfo: 1
        },
      },
    ])
      .skip(skipPage)
      .limit(pageSize);
    console.log(orders);
    res.status(200).send(orders);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ error: "Internal server error" });
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
        error: "Invalid order id",
      });
    }
    res.status(500).send({ error: "Internal Server Error" });
  }
};
