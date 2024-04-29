const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3001;
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/authRoutes");
const usersRoutes = require("./src/routes/usersRoutes");
const productsRoutes = require("./src/routes/productsRoutes");
const categoriesRoutes = require("./src/routes/categoriesRoutes");
const cartsRoutes = require("./src/routes/cartsRoutes");
const ordersRoutes = require("./src/routes/ordersRoutes");
const reviewsRoutes = require("./src/routes/reviewsRoutes");
const saleEventsRoutes = require("./src/routes/saleEventsRoutes");
const couponRoutes = require("./src/routes/couponsRoutes");

//middleware
app.use(cors());
app.use(express.json());
app.use(authRoutes)
app.use(usersRoutes);
app.use(productsRoutes);
app.use(categoriesRoutes);
app.use(cartsRoutes);
app.use(ordersRoutes);
app.use(reviewsRoutes);
app.use(saleEventsRoutes);
app.use(couponRoutes);

// Connection to MongoDB
async function startServer() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jgk3xtt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
    );

    console.log("Connected to MongoDB");
    // Start the server after successful connection
    app.listen(port, () => {
      console.log("Listening on port", port);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    // Handle the error or exit the application
    process.exit(1);
  }
}

// Start the server
startServer();
