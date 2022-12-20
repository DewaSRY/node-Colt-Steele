const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const user = require("../controlers/user");

router.route("/register").get(user.renderRegister).post(user.register);

router
  .route("/login")
  .get(user.renderLogin)
  .post(
    passport.authenticate("local", { failureRedirect: "/login" }),
    user.login
  );

router.get("/logout", user.logout);

module.exports = router;
