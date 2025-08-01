const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const { console } = require("inspector");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");
require("dotenv").config();

const MongoStore = require('connect-mongo');

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wander";
const DBurl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  try {
    await mongoose.connect(DBurl);
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
  }
}
app.engine("ejs",ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.static('public'));


const store = MongoStore.create({
  mongoUrl : DBurl,
  crypto : {
    secret : "mysupersecretcode",
  },
  touchAfter : 24 * 3600,
})

store.on("err" ,()=>{
  console.log("Error in Mongoose Session Error" , err);
})

const sessionoption = {
  store,
  secret : "mysupersecretcode",
  resave : false,
  saveUninitialized : true,
  cookie : {
     expires : Date.now() + 1000 * 60 * 60 * 24 * 3,
     maxAge : 1000 * 60 * 60 * 24 * 3,
     httpOnly : true
  }
};



app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

app.get("/demouser" , async(req,res) =>{
  let fakeuser = new User({
    email : "PJ@gmail.com",
    username  : "Priyansh"
  })
  let registerUser = await User.register(fakeuser,"Hello");
  res.send(registerUser);
})

app.use("/listings" , listings);
app.use("/listings/:id/reviews" , reviews);
app.use("/",user);

app.get("/", (req, res) => {
  res.send("Hi, I am root");
});
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });


app.all("*" , (req,res,next) =>{
  next(new ExpressError(404,"Page Not Found"));
})

app.use((err, req, res, next) => {
  let {status=500,message="Something Went Wrong!"} = err;
  //res.status(status).send(message);
  res.render("error.ejs",{err});
});


app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
