var express = require("express"),
	router  = express.Router(),
	passport = require("passport"),
	User    = require("../models/user");

//ROOT route

router.get('/', function(req, res) {
	res.render('landing')
});
//=============
//AUTH routes
//=============

router.get("/register", function(req, res) {
	res.render("register");
});

router.post("/register", function(req, res) {
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err) {
			return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome to Yelpcamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

//show login form

router.get("/login", function(req, res) {
	res.render("login");
});

//LOGIN logic

router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	successFlash: "Welcome back to Yelpcamp",
	failureRedirect: "/login",
	failureFlash: "Invalid username or password"
}), function(req, res){
	
});

//LOGOUT logic

router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "logged you out.");
	res.redirect("/campgrounds");
});

//middleware

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;