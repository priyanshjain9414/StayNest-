const express = require("express");
const router = express.Router({mergeParams : true});
const ExpressError = require("../utils/ExpressError.js");
const WrapAsync = require("../utils/WrapAsync.js");
const {listingSchema , reviewschema} = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {validateReview , isLogedin , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");
//Review Routes:-
//Post Review Route
router.post("/" , validateReview ,isLogedin,WrapAsync(reviewController.createReview))

//Post Review Route
router.delete("/:reviewid" ,isLogedin,isReviewAuthor, WrapAsync(reviewController.deleteReview))

module.exports = router;