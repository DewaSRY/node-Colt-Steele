const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const Review = require("../models/Review");
const { validateReview, isLoggedIn } = require("../middleware");
const router = express.Router({ mergeParams: true });
//

router.post(
  "/",
  validateReview,
  isLoggedIn,
  catchAsync(async (req, res) => {
    // const { id } = req.params;
    const campGrounds = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campGrounds.reviews.push(review);
    await review.save();
    await campGrounds.save();
    req.flash("success", "create new review");
    res.redirect(`/campGrounds/${campGrounds._id}`);
  })
);

router.delete(
  "/:reviewid",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findOneAndDelete(reviewId);
    res.redirect(`/campGrounds/${id}`);
  })
);
module.exports = router;
