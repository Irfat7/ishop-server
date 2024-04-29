const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController.js");

router.get("/users/:email", usersController.getSpecificUser);
router.get("/users/admin-check/:email", usersController.adminCheck);
router.get("/users", usersController.getAllUsers);
router.post("/users", usersController.createNewUser);
router.patch("/users/change-role", usersController.changeRole);

module.exports = router;
