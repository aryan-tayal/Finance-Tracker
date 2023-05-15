const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user");
const app = express();
const session = require("express-session");
const MongoDBStore = require("connect-mongo");
const bodyParser = require("body-parser");
const categoryRoutes = require("./routes/category");
const expenseRoutes = require("./routes/expense");
const userRoutes = require("./routes/user");

const passport = require("passport");
const LocalStrategy = require("passport-local");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
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
  res.send("home");
});

app.use("/category/:id/expense", expenseRoutes);
app.use("/category", categoryRoutes);

app.use("/", userRoutes);

app.listen(3000, (req, res) => {
  console.log("on port 3000");
});
