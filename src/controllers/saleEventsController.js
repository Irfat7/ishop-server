const SaleEvents = require("../models/SaleEvents");

exports.getAllSaleEvents = async (req, res) => {
  try {
    const allEvents = await SaleEvents.find().populate('products');
    const [firstEvent,] = allEvents
    res.status(200).send(firstEvent);
  } catch (error) {
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

//launch a new event
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

    res.status(200).send(newEvent);
  } catch (error) {
    if (
      error.name == "ValidationError" ||
      error.name == "CastError" ||
      error.name === "Error"
    ) {
      const message =
        error.name == "ValidationError" || error.name == "CastError"
          ? "Invalid event parameter passed"
          : error.message;
      return res.status(400).send({ error: message });
    }
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
};

//close an event
exports.closeAnEvent = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const deletedDocument = await SaleEvents.findOneAndDelete({ _id: eventId });
    if (!deletedDocument) {
      return res.status(404).send({
        error: "Event not found with the provided ID",
      });
    }
    res.status(200).send(deletedDocument);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).send({ error: "Invalid event id provided" });
    }
    res.status(500).send({
      error: "Internal Server Error",
    });
  }
};
