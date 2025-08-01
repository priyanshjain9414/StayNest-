const User = require("../models/user");


module.exports.renderSignupForm = (req,res) =>{
    res.render("user/signup.ejs");
};

module.exports.SignUp = async(req,res) =>{
    try{
    let {email,password,username} = req.body;
    let newUser = new User({email,username});
    const registerUser = await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser , (err) =>{
        if(err){
            return next(err);
        }
        req.flash("success" , "Welcome To StayNest");
        res.redirect("/listings");
    })

    }catch(e){
        req.flash("error",e.message);
        res.redirect("signup");
    }
}

module.exports.renderLoginForm = (req,res) =>{
    res.render("user/login.ejs");
};

module.exports.login = async(req,res)=>{
      req.flash("success","Welcome Back To StayNest");
      let redirecturl = res.locals.redirectUrl || "/listings"
      res.redirect(redirecturl);
}

module.exports.logout = (req,res,next) =>{
    req.logOut((err) => {
        if(err){
            return next(err);
        }
        req.flash("success" , "You Are Loggout Now");
        res.redirect("listings");
    })
};