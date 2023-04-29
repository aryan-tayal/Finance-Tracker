const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/financetracker");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.get("/", (req, res) => {
  res.send("home");
});

app.listen(3000, (req, res) => {
  console.log("on port 3000");
});
