const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController.js");

router.get("/users/:email", usersController.getSpecificUser);
router.get("/users", usersController.getAllUsers);
router.post("/users", usersController.createNewUser);

module.exports = router;
