const SaleEvents = require("../models/SaleEvents");

exports.getAllSaleEvents = async (req, res) => {
  try {
    const allEvents = await SaleEvents.find();
    res.status(201).send(allEvents);
  } catch (error) {
    res.status(500).send({
      error: true,
      message: "Internal Server Error",
    });
  }
};

exports.launchNewEvent = async (req, res) => {
  try {
    const { name, products, mainDiscount, discountForCheapProducts } = req.body;

    const newEvent = await new SaleEvents({
      name,
      products,
      mainDiscount,
      discountForCheapProducts,
    });

    await newEvent.save();

    res.status(201).send(newEvent);
  } catch (error) {
    console.log(error.message);
    if (
      error.name == "ValidationError" ||
      error.name == "CastError" ||
      error.name === "Error"
    ) {
      const message =
        error.name == "ValidationError" || error.name == "CastError"
          ? "Invalid event parameter passed"
          : error.message;
      return res.status(400).send({ error: true, message });
    }
    res.status(500).send({
      error: true,
      message: "Internal Server Error",
    });
  }
};
