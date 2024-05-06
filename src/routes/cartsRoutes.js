const cartsController = require("../controllers/cartsController");
const express = require("express");
const { authenticateToken } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/carts", cartsController.addToCart);
router.get("/carts/user", /* authenticateToken, */ cartsController.getCartOfUser);
router.patch("/carts/user", /* authenticateToken, */ cartsController.updateCarts);

module.exports = router;