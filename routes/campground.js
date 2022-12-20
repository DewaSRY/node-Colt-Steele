const express = require("express");
const catchAsync = require("../utils/catchAsync");
const ExpresError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/Review");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const campGround = require("../controlers/campGround");
const router = express.Router();

router
  .route("/")
  .get(campGround.index)
  .post(validateCampground, catchAsync(campGround.createCampGround));
router.get("/new", isLoggedIn, campGround.renderNewForm);

router
  .route("/:id")
  .get(isLoggedIn, catchAsync(campGround.showCampGround))
  .put(isAuthor, catchAsync(campGround.updateCampGround))
  .delete(isLoggedIn, catchAsync(campGround.deleteCampGround));
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campGround.editCampGround)
);

module.exports = router;
