const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
const Users = require("./models/Users");
const Categories = require("./models/Categories");
const Products = require("./models/Products");
const Reviews = require("./models/Reviews");

//middleware
app.use(cors());
app.use(express.json());

//connection
mongoose.connect(
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jgk3xtt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
);

//users-api
//all-users
app.get("/users", async (req, res) => {
  try {
    const results = await Users.find();

    res.status(200).send(results);
  } catch (error) {
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
});

//new-user
app.post("/users", async (req, res) => {
  try {
    const { name, email, imageUrl } = req.body;

    const emailAlreadyExists = await Users.exists({ email: email });
    if (emailAlreadyExists) {
      return res.send({ emailExists: true });
    }

    const newUser = await Users.create({
      name: name,
      email: email,
      imageUrl: imageUrl,
      createdAt: new Date(),
    });

    res.status(200).send(newUser);
  } catch (error) {
    res.status(500).send({ error: true, message: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log("listening", port);
});
