const express = require("express");
const router = express.Router();
const couponController = require("../controllers/couponsController");
const {
  authenticateToken,
  verifyAdmin,
} = require("../middlewares/authMiddleware");

router.post(
  "/coupons",
  authenticateToken,
  verifyAdmin,
  couponController.addNewCoupon
);
router.delete(
  "/coupons/:couponId",
  authenticateToken,
  verifyAdmin,
  couponController.deleteCoupon
);
router.patch(
  "/coupons/:couponId",
  authenticateToken,
  verifyAdmin,
  couponController.updateExistingCoupon
);
router.get("/coupons", authenticateToken, couponController.getExistingCoupon);
router.get(
  "/coupons/:couponCode",
  authenticateToken,
  couponController.getCouponByCode
);
router.patch(
  "/coupons/use-coupon/:couponCode",
  authenticateToken,
  couponController.reduceCouponQuantity
);

module.exports = router;
