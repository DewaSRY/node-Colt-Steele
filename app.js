const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
// ejsMate for boilerplate____________________
const ejsMate = require("ejs-mate");
// joi for falidations_________________________________________________
const flash = require("connect-flash");
const userRouters = require("./routes/user");
const campgroundRouters = require("./routes/campground");
const reviewRouters = require("./routes/review");

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  console.log(req.session);
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

main()
  .then(() => console.log("Mongoose was working_______________________"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/yelpCamp", {
    family: 4,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

app.use("/", userRouters);
app.use("/campGrounds", campgroundRouters);
app.use("/campGrounds/:id/reviews", reviewRouters);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new ExpresError(("page not fond", 404)));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.masage) err.masage = "oh no somethng whe wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => console.log("expres was working"));
