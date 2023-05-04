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
app.get("/category/:id", async (req, res) => {
  const category = await Category.findById(req.params.id).populate("expenses");
  res.send(category);
});
// app.get("/category/:id/expense/:categoryId", async (req, res) => {
//   const expense = await Expense.findById(req.params.id);
//   res.send(expense);
// });
app.post("/category", async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.send(category);
});
app.post("/category/:id/expense", async (req, res) => {
  const expense = new Expense(req.body);
  const category = await Category.findById(req.params.id);
  category.expenses.push(expense);
  category.totalSpent += expense.moneySpent;
  category.totalSpent > category.budget
    ? (category.hasExceededBudget = true)
    : (category.hasExceededBudget = false);
  await expense.save();
  await category.save();
  res.send({ category, expense });
});

app.put("/category/:id", async (req, res) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    {
      ...req.body,
    },
    { new: true }
  );
  res.send({ category });
});
app.put("/category/:id/expense/:expenseId", async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(
    req.params.expenseId,
    {
      ...req.body,
    },
    { new: true }
  );
  const category = await Category.findById(req.params.id);
  category.totalSpent += expense.moneySpent;
  category.totalSpent > category.budget
    ? (category.hasExceededBudget = true)
    : (category.hasExceededBudget = false);
  await expense.save();
  await category.save();
  res.send({ category, expense });
});

app.delete("/category/:id/expense/:expenseId", async (req, res) => {
  await Category.findByIdAndUpdate(req.params.id, {
    $pull: { expenses: req.params.expenseId },
  });
  await Expense.findByIdAndDelete(req.params.expenseId);
  res.send("successfully deleted expense");
});
app.delete("/category/:id", async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.send("successfully deleted category");
});

app.listen(3000, (req, res) => {
  console.log("on port 3000");
});
