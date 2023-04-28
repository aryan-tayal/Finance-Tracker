const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("home");
});

app.listen(3000, (req, res) => {
  console.log("on port 3000");
});
