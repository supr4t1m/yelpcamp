var express = require("express"),
	router  = express.Router(),
	passport = require("passport"),
	User    = require("../models/user"),
	Campground = require("../models/campgrounds"),
	async   = require("async"),
	nodemailer = require("nodemailer"),
	crypto  = require("crypto");

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
			req.flash("success", "Welcome to Yelpcamp");
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



// password reset 

//GET forgot 
router.get("/forgot", function(req, res) {
	res.render("forgot");
})

// POST forgot

// since async waterfall will process asynchronous functions
// we need to pass the errors returned by those in next() so 
// that express can process it
// for more information visit https://expressjs.com/en/guide/error-handling.html
router.post("/forgot", function(req, res, next) {
	async.waterfall([
		// generate the 20 bytes long token randomly
		function(done) {
			crypto.randomBytes(20, function(err, buffer) {
				var token = buffer.toString("hex");
				done(err, token);
			});
		},
		
		// check if the user with the email exists, if so set the token validity to 1 hour
		function(token, done) {
			User.findOne({email: req.body.email}, function(err, user) {
				if (!user) {
					req.flash("error", "No account exists with that email.");
					return res.redirect("/forgot");
				}
				
				user.resetPasswordToken = token;
				user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
				
				user.save(function(err) {
					done(err, token, user);
				});
			});
		},
		
		function(token, user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: "Gmail",
				auth: {
					user: process.env.GMAIL,
					pass: process.env.GMAILPW
				}
			});
			
			var mailOptions = {
				to: `${user.username} <${user.email}>`,
				from: `Yelpcamp Admin <${process.env.GMAIL}>`,
				subject: "Yelpcamp password reset",
				text: "Hello " + user.username + ",\n\n" + 
				"You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
				"Please click on the following link or paste this into your browser to complete the process:\n\n" +
				"http://"+req.headers.host+"/reset/"+token+"\n\n" +
				"If you did not request this, please ignore this email and your password will remain unchanged.\n"
			};
			
			smtpTransport.sendMail(mailOptions, function(err) {
				console.log("mail sent to " + user.email);
				req.flash("success", "An e-mail has been sent to " + user.email + " with further instructions.");
				done(err, "done");
			});
		}
	// if any of the function throw error this callback will be executed right after
	], function(err) {
		if (err) return next(err);
		res.redirect("/forgot");
	});
});

// ask the user for new password if the token is valid
router.get("/reset/:token", function(req, res) {
	User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		if (!user) {
			req.flash("error", "Password reset token is invalid or has expired");
			return res.redirect("/forgot");
		}
		
		res.render("reset", {token: req.params.token});
	});
});

// reset the password in this post request
router.post("/reset/:token", function(req, res) {
	async.waterfall([
		
		// set the password
		function(done) {
			User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now() } }, function(err, user) {
				if (!user) {
					req.flash("error", "Password reset token is invalid or has expired.");
					return res.redirect("back");
				}
				
				if (req.body.password === req.body.confirm) {
					user.setPassword(req.body.password, function(err) {
						user.resetPasswordToken = undefined;
						user.resetPasswordExpires = undefined;
						
						user.save(function(err) {
							req.logIn(user, function(err) {
								done(err, user);
							});
						});
					});
				} else {
					req.flash("error", "Passwords do not match");
					return res.redirect("back");
				}
			});
		},
		
		// send the user the confirmation mail
		function(user, done) {
			var smtpTransport = nodemailer.createTransport({
				service: "Gmail", 
				auth: {
					user: process.env.GMAIL,
					pass: process.env.GMAILPW
				}
			});
			
			var mailOptions = {
				to: `${user.username} <${user.email}>`,
				from: `Yelpcamp Admin <${process.env.GMAIL}>`,
				subject: "Your password has been changed",
				text: "Hello " +user.username + ",\n\n" +
				"This is a confirmation that the password for your account " + user.email + " has just been changed.\n"
			};
			
			smtpTransport.sendMail(mailOptions, function(err) {
				req.flash("success", "Your password has been changed successfully");
				done(err);
			});
		}
	], function(err) {
		res.redirect("/campgrounds");
	});
});

module.exports = router;