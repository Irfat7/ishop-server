const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponsController");

router.post("/coupons", couponController.addNewCoupon);
router.delete("/coupons/:couponId", couponController.deleteCoupon);

module.exports = router;
