const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const {
  createNewOverallReview,
  getReview,
} = require("../controllers/overallReviewsController");
const router = express.Router();

router.post("/overallReviews", authenticateToken, createNewOverallReview);
router.get("/overallReviews", getReview);

module.exports = router;
