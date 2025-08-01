const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
}

module.exports.renderShow = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate({path : "review" , populate:{path : "author"},}).populate("owner");
  if(!listing){
    req.flash("error" , "Listing Not Found");
    res.redirect("/listings")
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.create = async (req, res,next) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success" , "New Listing Created Sucessfully!");
  res.redirect("/listings");
}

module.exports.Edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if(!listing){
    req.flash("error" , "Listing Not Found");
    res.redirect("/listings")
  }
  res.render("listings/edit.ejs", { listing });
}

module.exports.update = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
   req.flash("success" , "Listing Updated Sucessfully!");
  res.redirect(`/listings/${id}`);
}

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success" , "Review Deleted Sucessfully!");
  res.redirect("/listings");
}