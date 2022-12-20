const Review = require("../models/Review");
const Campground = require("../models/campground");

module.exports.makeReview = async (req, res) => {
  const { id } = req.params;
  const campGrounds = await Campground.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campGrounds.reviews.push(review);
  await review.save();
  await campGrounds.save();
  req.flash("success", "create new review");
  res.redirect(`/campGrounds/${campGrounds._id}`);
};
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findOneAndDelete(reviewId);
  res.redirect(`/campGrounds/${id}`);
};
