const express = require("express");
const router = express.Router();

const Category = require("../models/category");
const User = require("../models/user");

router.post("/", async (req, res) => {
  const category = new Category(req.body);
  const user = await User.findById(req.user._id);
  category.user = user._id;
  user.categories.push(category);
  await category.save();
  await user.save();
  res.send(category);
});

router
  .route("/:id")
  .get(async (req, res) => {
    const category = await Category.findById(req.params.id).populate(
      "expenses"
    );
    res.send(category);
  })
  .put(async (req, res) => {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true }
    );
    res.send({ category });
  })
  .delete(async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.send("successfully deleted category");
  });

module.exports = router;
