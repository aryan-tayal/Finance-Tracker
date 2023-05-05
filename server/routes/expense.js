const express = require("express");
const router = express.Router();

const Expense = require("../models/expense");
const Category = require("../models/category");

router.post("/:id/expense/", async (req, res) => {
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

router
  .route("/:id/expense/:expenseId")
  .put(async (req, res) => {
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
  })
  .delete(async (req, res) => {
    await Category.findByIdAndUpdate(req.params.id, {
      $pull: { expenses: req.params.expenseId },
    });
    await Expense.findByIdAndDelete(req.params.expenseId);
    res.send("successfully deleted expense");
  });

module.exports = router;
