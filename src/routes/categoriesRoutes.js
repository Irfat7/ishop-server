const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");

router.get("/categories/:categoryName", categoriesController.getAllofACategory);
router.get("/categories", categoriesController.getAllCategory);
router.post("/categories", categoriesController.createCategory);

module.exports = router;
