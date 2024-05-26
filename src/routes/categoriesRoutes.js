const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categoriesController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/categories/:categoryName", categoriesController.getAllofACategory);
router.get("/categories", categoriesController.getAllCategory);
router.post(
  "/categories",
  authenticateToken,
  categoriesController.createCategory
);

module.exports = router;
