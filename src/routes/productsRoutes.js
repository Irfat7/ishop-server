const express = require("express");
const router = express.Router();
const productsController = require("../controllers/productsController");

router.post("/products", productsController.createProduct);
router.get("/products/:productId", productsController.getSpecificProduct);
router.get("/products", productsController.getAllProducts);
router.get("/products/items/search/", productsController.searchProducts);
router.patch("/products/:productId", productsController.updateProduct);
router.delete("/products/:productId", productsController.deleteProduct);

module.exports = router;
