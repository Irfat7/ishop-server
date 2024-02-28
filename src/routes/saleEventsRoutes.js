const express = require("express");
const router = express.Router();
const saleEventsController = require("../controllers/saleEventsController");

router.get("/events", saleEventsController.getAllSaleEvents);
router.post("/events", saleEventsController.launchNewEvent);

module.exports = router;
