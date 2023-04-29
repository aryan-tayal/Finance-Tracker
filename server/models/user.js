const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { default: String, unique: true },
  password: String,
  email: { default: String, unique: true },
  categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
});

module.exports = mongoose.model("User", userSchema);
