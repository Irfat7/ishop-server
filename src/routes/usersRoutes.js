const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController.js");
const {
  authenticateToken,
  verifyAdmin,
} = require("../middlewares/authMiddleware.js");

router.get(
  "/users/admin-check/:email",
  authenticateToken,
  usersController.adminCheck
);
router.get(
  "/users/:email",
  authenticateToken,
  verifyAdmin,
  usersController.getSpecificUser
);
router.get(
  "/users",
  authenticateToken,
  verifyAdmin,
  usersController.getAllUsers
);
router.get(
  "/users/id-map/getUser",
  authenticateToken,
  usersController.getUserId
);
router.post("/users", authenticateToken, usersController.createNewUser);
router.patch(
  "/users/change-role",
  authenticateToken,
  verifyAdmin,
  usersController.changeRole
);

module.exports = router;
