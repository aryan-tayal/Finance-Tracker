const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Category = require("./models/category");
const Expense = require("./models/expense");
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb://127.0.0.1:27017/financetracker");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.get("/", (req, res) => {
  res.send("home");
});
app.post("/category", async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.send(category);
});
app.post("/expense", async (req, res) => {
  const expense = new Expense(req.body);
  const category = await Category.findOne({ title: req.body.category });
  category.expenses.push(expense);
  console.log(expense);
  category.totalSpent += expense.moneySpent;
  category.totalSpent > category.budget
    ? (category.hasExceededBudget = true)
    : (category.hasExceededBudget = false);
  await expense.save();
  await category.save();
  res.send({ category, expense });
});
app.put("/expense", async (req, res) => {
  const expense = await Expense.findOneAndUpdate(
    { title: req.body.expense },
    { ...req.body }
  );
  console.log(req.body.expense);
  console.log(expense);
  const category = await Category.findOne({ title: req.body.category });
  category.totalSpent += expense.moneySpent;
  category.totalSpent > category.budget
    ? (category.hasExceededBudget = true)
    : (category.hasExceededBudget = false);
  await expense.save();
  await category.save();
  res.send({ category, expense });
});
app.put("/category", async (req, res) => {
  const category = await Category.findOneAndUpdate(
    { title: req.body.category },
    { ...req.body }
  );  
  res.send({ category });
});
app.delete("/expense", async (req, res) => {
  await Expense.deleteOne({ title: req.expense });
  res.send("successfully deleted expense");
});
app.delete("/category", async (req, res) => {
  await Category.deleteOne({ title: req.category });
  res.send("successfully deleted category");
});
app.listen(3000, (req, res) => {
  console.log("on port 3000");
});
