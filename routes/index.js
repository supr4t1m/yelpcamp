var express = require("express"),
	router  = express.Router(),
	passport = require("passport"),
	User    = require("../models/user"),
	Campground = require("../models/campgrounds");

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
	// do not store password as password will be hashed by passport js before getting stored
	var newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		avatar: req.body.avatar,
		bio: req.body.bio
	});
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

// USER PROFILE
router.get("/users/:id", function(req, res) {
	User.findById(req.params.id, function(err, user) {
		const backUrl = req.headers.referer || "/campgrounds";
		
		if (err) {
			req.flash("error", "error finding user");
			return res.redirect(backUrl);
		}
		
		if (!user) {
			req.flash("error", "user doesn't exist");
			return res.redirect(backUrl);
		}
		
		// we have built up the query before executing, this way we don't have to pass json objects as query
		
		// .id is a virtual getter function to return string of ._id, set default by mongoose
		Campground.find().where("author.id").equals(user.id).exec(function(err, campgrounds) {
			// campgrounds object is passed without a key, the key will automatically be named campgrounds with values as contents of campgrounds object
			// same with user
			if (err) {
				req.flash("error", "unable to find campgrounds with current user, something went wrong.");
				return res.redirect(backUrl);
			}
			
			res.render("users/shows", {user, campgrounds});
		})
	})
})

module.exports = router;