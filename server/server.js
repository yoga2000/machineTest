const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const { dbConnection } = require("./dbConnection/db");
dotenv.config();
const app = express();

// middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// db connection
dbConnection();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Admin routes
const userRoute = require("./router/userRoute");
app.use("/api/admin", userRoute);

// Employee routes
const employeeRoute = require("./router/employeeRoute");
app.use("/api/employee", employeeRoute);

// Middleware for serving static files
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
