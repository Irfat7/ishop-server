const express = require("express");
const {
  createNewOverallReview,
  getReview,
} = require("../controllers/overallReviewsController");
const router = express.Router();

router.post("/overallReviews", createNewOverallReview);
router.get("/overallReviews", getReview);

module.exports = router;