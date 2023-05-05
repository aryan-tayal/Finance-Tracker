const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Category = require("./models/category");
const Expense = require("./models/expense");
const User = require("./models/user");
const app = express();
const passport = require("passport");
const session = require("express-session");
const MongoDBStore = require("connect-mongo");

const categoryRoutes = require("./routes/category");
const expenseRoutes = require("./routes/expense");
const userRoutes = require("./routes/user");

const LocalStrategy = require("passport-local");

app.use(cors());
app.use(express.urlencoded({ extended: true }));

const dbUrl = "mongodb://127.0.0.1:27017/financetracker";

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});
const secret = "thisshouldbeabettersecret";
const store = MongoDBStore.create({
  mongoUrl: dbUrl,
  secret: secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
  console.log("Session error", e);
});

const sessionConfig = {
  store,
  name: "session",
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure:true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.use(new LocalStrategy(User.authenticate()));

app.get("/", (req, res) => {
  console.log(req.user);
  res.send("home");
});

app.use("/category", categoryRoutes);
app.use("/category", expenseRoutes);
app.use('/', userRoutes);

app.get("/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id).populate("categories");
  res.send(user);
});
// app.get("/category/:id", async (req, res) => {
//   const category = await Category.findById(req.params.id).populate("expenses");
//   res.send(category);
// });
// app.get("/category/:id/expense/:categoryId", async (req, res) => {
//   const expense = await Expense.findById(req.params.id);
//   res.send(expense);
// });
// app.post("/category", async (req, res) => {
//   const category = new Category(req.body);
//   const user = await User.findById(req.user._id);
//   category.user = user._id;
//   user.category.push(user);
//   await category.save();
//   await user.save();
//   res.send(category);
// });
// app.post("/category/:id/expense", async (req, res) => {
//   const expense = new Expense(req.body);
//   const category = await Category.findById(req.params.id);
//   category.expenses.push(expense);
//   category.totalSpent += expense.moneySpent;
//   category.totalSpent > category.budget
//     ? (category.hasExceededBudget = true)
//     : (category.hasExceededBudget = false);
//   await expense.save();
//   await category.save();
//   res.send({ category, expense });
// });

// app.put("/category/:id", async (req, res) => {
//   const category = await Category.findByIdAndUpdate(
//     req.params.id,
//     {
//       ...req.body,
//     },
//     { new: true }
//   );
//   res.send({ category });
// });
// app.put("/category/:id/expense/:expenseId", async (req, res) => {
//   const expense = await Expense.findByIdAndUpdate(
//     req.params.expenseId,
//     {
//       ...req.body,
//     },
//     { new: true }
//   );
//   const category = await Category.findById(req.params.id);
//   category.totalSpent += expense.moneySpent;
//   category.totalSpent > category.budget
//     ? (category.hasExceededBudget = true)
//     : (category.hasExceededBudget = false);
//   await expense.save();
//   await category.save();
//   res.send({ category, expense });
// });

// app.delete("/category/:id/expense/:expenseId", async (req, res) => {
//   await Category.findByIdAndUpdate(req.params.id, {
//     $pull: { expenses: req.params.expenseId },
//   });
//   await Expense.findByIdAndDelete(req.params.expenseId);
//   res.send("successfully deleted expense");
// });
// app.delete("/category/:id", async (req, res) => {
//   await Category.findByIdAndDelete(req.params.id);
//   res.send("successfully deleted category");
// });

// app.post("/register", async (req, res) => {
//   const { email, username, password } = req.body;
//   const user = new User({ username, email });
//   const registeredUser = await User.register(user, password);
//   req.login(registeredUser, (err) => {
//     if (err) {
//       console.log("ERROR ! ", err);
//       res.send(err);
//     }
//   });
//   res.send(user);
// });
// app.post("/login", passport.authenticate("local"), async (req, res) => {
//   console.log(req.user);
//   res.send("successful");
// });
// app.post("/logout", async (req, res) => {
//   req.logout((err) => {
//     if (err) {
//       console.log("ERROR ! ", err);
//       res.send(err);
//     }
//   });
//   res.send("successfully logged out");
// });
// app.put("/user/:id", async (req, res) => {
//   const user = await User.findByIdAndUpdate(
//     req.params.id,
//     { ...req.body },
//     { new: true }
//   );
//   res.send(user);
// });
// app.delete("/user/:id", async (req, res) => {
//   await User.findByIdAndDelete(req.params.id);
//   res.send("successfully deleted account");
// });
app.listen(3000, (req, res) => {
  console.log("on port 3000");
});
