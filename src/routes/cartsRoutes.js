const cartsController = require("../controllers/cartsController");
const express = require("express");
const router = express.Router();

router.post("/carts", cartsController.addToCart);

module.exports = router;
