const express = require("express");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
const router = express.Router({ mergeParams: true });
const review = require("../controlers/review");

router.post(
  "/",
  // isReviewAuthor,
  validateReview,
  isLoggedIn,
  catchAsync(review.makeReview)
);

router.delete(
  "/:reviewId",
  // isReviewAuthor,
  isLoggedIn,
  catchAsync(review.deleteReview)
);
module.exports = router;
