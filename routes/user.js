const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js")

router.route("/signup")
.get(userController.renderSignupForm)
.post(WrapAsync(userController.SignUp));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,
           passport.authenticate("local",{failureRedirect:"/login"
            ,failureFlash:true}) , WrapAsync(userController.login))

router.get("/logout" , userController.logout);

module.exports = router;