const express = require("express");
const {
  createNewOverallReview,
} = require("../controllers/overallReviewsController");
const router = express.Router();

router.post("/overallReviews", createNewOverallReview);

module.exports = router;