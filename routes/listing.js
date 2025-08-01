const express = require("express");
const router = express.Router();
const ExpressError = require("../utils/ExpressError.js");
const WrapAsync = require("../utils/WrapAsync.js");
const {listingSchema , reviewschema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLogedin,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");


router.route("/")
//Index Route
.get(WrapAsync(listingController.index))
//Create Route
.post(validateListing,WrapAsync(listingController.create));


//New Route
router.get("/new",isLogedin, listingController.renderNewForm);

//Edit Route
router.get("/:id/edit",isLogedin,isOwner, 
            WrapAsync(listingController.Edit));

router.route("/:id")
//Show Route
.get(WrapAsync(listingController.renderShow))
//Update Route
.put(validateListing,isLogedin, 
           isOwner,WrapAsync(listingController.update))
//Delete Route
.delete(isLogedin,isOwner,
            WrapAsync(listingController.delete));

module.exports = router;
