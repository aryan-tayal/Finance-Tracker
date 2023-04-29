const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  title: "String",
  description: "String",
  budget: "Number",
  hasExceededBudget: {
    type: Boolean,
    default: false,
  },
  totalSpent: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  expenses: [{ type: Schema.Types.ObjectId, ref: "Expense" }],
});

module.exports = mongoose.model("Category", categorySchema);
