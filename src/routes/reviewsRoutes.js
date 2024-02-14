const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviewsController");

router.get("/reviews/:userId", reviewsController.getReviewByUserId);

module.exports = router;
