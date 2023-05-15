const express = require("express");
const router = express.Router();

const passport = require("passport");

const User = require("../models/user");

router.post("/register", async (req, res) => {
  const { email, username, password } = req.body;
  const user = new User({ username, email });
  const registeredUser = await User.register(user, password);
  req.login(registeredUser, (err) => {
    if (err) {
      console.log("ERROR ! ", err);
      res.send(err);
    }
  });
  res.send(user);
});

router.post("/login", passport.authenticate("local"), async (req, res) => {
  res.send("successful");
});

router.post("/logout", async (req, res) => {
  req.logout((err) => {
    if (err) {
      console.log("ERROR ! ", err);
      res.send(err);
    }
  });
  res.send("successfully logged out");
});

router
  .route("/user/:id")
  .get(async (req, res) => {
    const user = await User.findById(req.params.id).populate("categories");
    res.send(user);
  })
  .put(async (req, res) => {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    res.send(user);
  })
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.send("successfully deleted account");
  });

module.exports = router;
