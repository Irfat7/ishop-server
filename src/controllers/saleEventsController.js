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
    const { name, products } = req.body;

    const newEvent = await new SaleEvents({
      name,
      products,
    });

    await newEvent.save();

    res.status(201).send(newEvent);
  } catch (error) {
    if (error.name == "ValidationError" || error.name == "CastError") {
      const message =
        error.name == "ValidationError" || error.name == "CastError"
          ? "Invalid Product information passed"
          : error.message;
      return res.status(401).send({ error: true, message });
    }
    res.status(500).send({
      error: true,
      message: "Internal Server Error",
    });
  }
};
