const { campgroundSchema, reviewSchema } = require("./schemas");
const ExpresError = require("./utils/ExpressError");
const Campground = require("./models/campground");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpresError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campGround = await Campground.findById(id);
  if (!campGround.author.equals(req.user._id)) {
    req.flash("error", "you do not allowet to do it");
    return res.redirect(`/campGrounds/${campGround._id}`);
  }
  next();
};
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpresError(msg, 400);
  } else {
    next();
  }
};
