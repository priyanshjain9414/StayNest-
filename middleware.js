const Listing = require("./models/listing");
const ExpressError = require("./utils/ExpressError.js");
const WrapAsync = require("./utils/WrapAsync.js");
const {listingSchema , reviewschema} = require("./schema.js");
const Review = require("./models/review.js");

module.exports.isLogedin  = (req,res,next) =>{
    if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;
    req.flash("error","You Must Be Logged In To Add New Listing");
    return res.redirect("/login");
    }
    next();
  };

module.exports.saveRedirectUrl = (req,res,next) =>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner = async(req,res,next) =>{
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner._id.equals(res.locals.currUser._id)){
    req.flash("error" , "You Don't Have Permission To Update Listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
}

module.exports.validateListing = (req,res,next) => {
      let {error} = listingSchema.validate(req.body);
      if(error){
         throw new ExpressError(400,error);
      }else{
        next();
      }
}

module.exports.validateReview = (req,res,next) => {
      let {error} = reviewschema.validate(req.body);
      if(error){
         throw new ExpressError(400,error);
      }else{
        next();
      }
}

module.exports.isReviewAuthor = async(req,res,next) =>{
  let { id,reviewid } = req.params;
  let review = await Review.findById(reviewid);
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error" , "You Don't Have Permission To Delete This Review");
    return res.redirect(`/listings/${id}`);
  }
  next();
}
