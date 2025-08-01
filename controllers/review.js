const Review = require("../models/review");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req,res) =>{
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.review.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success" , "New Review Created Sucessfully!");
  res.redirect(`/listings/${listing.id}`);
}

module.exports.deleteReview = async(req,res) =>{
     let {id,reviewid} = req.params;
     await Listing.findByIdAndUpdate(id, {$pull : {review : reviewid}})
     await Review.findByIdAndDelete(reviewid);
     req.flash("success" , "Review Deleted Sucessfully!");
     res.redirect(`/listings/${id}`);
}