const express = require("express");

const catchAsync = require("../utils/catchAsync");
const ExpresError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/Review");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

const router = express.Router();

router.get("/", async (req, res) => {
  const campGround = await Campground.find({});
  res.render("campGrounds/index", { campGround });
});
router.get(
  "/new",
  isLoggedIn,
  catchAsync(async (req, res) => {
    if (!req.isAuthenticated()) {
      req.flash("error", "you must be signed in");
      res.redirect("/login");
    }
    res.render("campGrounds/new");
  })
);

router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campGrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campGround = await Campground.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("author");
    console.log(campGround);
    if (!campGround) {
      req.flash("error", "ca");
    }
    res.render("campGrounds/show", { campGround });
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campGround = await Campground.findById(id);
    if (!campGround) {
      req.flash("error", "can not find the campGround");
      return res.redirect(`/campGrounds/${campGround._id}`);
    }
    res.render("campGrounds/edit", { campGround });
  })
);
router.put(
  "/:id",
  isAuthor,
  catchAsync(async (req, res) => {
    const camp = await Campground.findByIdAndUpdate(id, {
      ...req.body.campGround,
    });
    req.flash("susccess", "succefully update campground");
    res.redirect(`/campGrounds/${camp._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campGrounds`);
  })
);
module.exports = router;
