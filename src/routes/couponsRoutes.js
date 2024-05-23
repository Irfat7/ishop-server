const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponsController");

router.post("/coupons", couponController.addNewCoupon);
router.delete("/coupons/:couponId", couponController.deleteCoupon);
router.patch("/coupons/:couponId", couponController.updateExistingCoupon);
router.get("/coupons", couponController.getExistingCoupon);
router.get("/coupons/:couponCode", couponController.getCouponByCode);

module.exports = router;
