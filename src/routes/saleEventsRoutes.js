const express = require("express");
const router = express.Router();
const saleEventsController = require("../controllers/saleEventsController");
const {
  authenticateToken,
  verifyAdmin,
} = require("../middlewares/authMiddleware");

router.get("/events", saleEventsController.getAllSaleEvents);
router.post(
  "/events",
  authenticateToken,
  verifyAdmin,
  saleEventsController.launchNewEvent
);
router.delete(
  "/events/:eventId",
  authenticateToken,
  verifyAdmin,
  saleEventsController.closeAnEvent
);

module.exports = router;
