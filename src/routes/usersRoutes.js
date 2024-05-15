const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController.js");
const { authenticateToken } = require("../middlewares/authMiddleware.js");

router.get(
  "/users/admin-check/:email",
  authenticateToken,
  usersController.adminCheck
);
router.get("/users/:email", usersController.getSpecificUser);
router.get("/users", usersController.getAllUsers);
router.get(
  "/users/id-map/getUser",
  authenticateToken,
  usersController.getUserId
);
router.post("/users", usersController.createNewUser);
router.patch("/users/change-role", usersController.changeRole);

module.exports = router;
