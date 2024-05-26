const cartsController = require("../controllers/cartsController");
const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/carts", authenticateToken, cartsController.addToCart);
router.get("/carts/user", authenticateToken, cartsController.getCartOfUser);
router.patch("/carts/user", authenticateToken, cartsController.updateCarts);
router.delete(
  "/carts/:cartId",
  authenticateToken,
  cartsController.deleteProductFromCart
);

module.exports = router;
