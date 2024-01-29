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

app.get("/", async (req, res) => {
  const result = await Users.create({
    name: "SAKA",
    email: "SAKA@GMAIL.COM",
    imageUrl: "sakaimage",
    created_at: new Date(),
    reviewDone: [],
  });
  res.send(result);
});

app.listen(port, () => {
  console.log("listening", port);
});

//sample
/* app.get("/create", async (req, res) => {
    try {
      const result = await Users.create({
        name: "Irfat",
        age: 25,
        email: "imirfat@gmail.com",
      });
      console.log("added");
      res.send(result);
    } catch (error) {
      console.log(error);
    }
  }); */
