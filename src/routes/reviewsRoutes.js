const express = require("express");
const router = express.Router();
const reviewsController = require("../controllers/reviewsController");

router.get("/reviews/byUser/:userId", reviewsController.getReviewByUserId);
router.get("/reviews/byProduct/:productId", reviewsController.getReviewByProductId);

module.exports = router;
