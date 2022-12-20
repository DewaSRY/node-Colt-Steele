const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
router.get("/register", (req, res) => {
  res.render("users/register");
});
router.post("/register", async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registerUser = await User.register(user, password);
    req.logIn(registerUser, (err) => {
      if (err) return next(err);
      req.flash("success", "welcome to yelp camp!!");
      res.redirect("/campGrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    req.flash("success", "welcome back!");
    // res.redirect("/campGrounds");
    const redirectUrl = req.session.returnTo || "/campGrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    req.flash("success", "Goodbye!");
    res.redirect("/campGrounds");
  });
});

module.exports = router;
