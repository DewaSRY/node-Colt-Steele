const Campground = require("../models/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const catchAsync = require("../utils/catchAsync");
const ExpresError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
  const campGround = await Campground.find({});
  res.render("campGrounds/index", { campGround });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampGround = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campGrounds/${campground._id}`);
};
module.exports.showCampGround = async (req, res) => {
  const { id } = req.params;
  const campGround = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campGround) {
    req.flash("error", "ca");
  }
  res.render("campGrounds/show", { campGround });
};
module.exports.editCampGround = async (req, res) => {
  const { id } = req.params;
  const campGround = await Campground.findById(id);
  if (!campGround) {
    req.flash("error", "can not find the campGround");
    return res.redirect(`/campGrounds/${campGround._id}`);
  }
  res.render("campGrounds/edit", { campGround });
};
module.exports.updateCampGround = async (req, res) => {
  const camp = await Campground.findByIdAndUpdate(id, {
    ...req.body.campGround,
  });
  req.flash("susccess", "succefully update campground");
  res.redirect(`/campGrounds/${camp._id}`);
};
module.exports.deleteCampGround = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect(`/campGrounds`);
};
