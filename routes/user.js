var express = require("express"),
	router  = express.Router(),
	User	= require("../models/user"),
	Campground = require("../models/campgrounds"),
	middleware = require("../middleware");
	

// USER PROFILE

// GET /users/:id
router.get("/:id", function(req, res) {
	User.findById(req.params.id, function(err, user) {
		
		if (err) {
			req.flash("error", "error finding user");
			return res.redirect("back");
		}
		
		if (!user) {
			req.flash("error", "user doesn't exist");
			return res.redirect("back");
		}
		
		// we have built up the query before executing, this way we don't have to pass json objects as query
		
		// .id is a virtual getter function to return string of ._id, set default by mongoose
		Campground.find().where("author.id").equals(user.id).exec(function(err, campgrounds) {
			// campgrounds object is passed without a key, the key will automatically be named campgrounds with values as contents of campgrounds object
			// same with user
			if (err) {
				req.flash("error", "unable to find campgrounds with current user, something went wrong.");
				return res.redirect("back");
			}
			
			res.render("users/shows", {user, campgrounds});
		});
	});
});

// GET /users/:id/edit 
router.get("/:id/edit", middleware.checkProfileOwnership, function(req, res) {
	res.render("users/edit", {user: req.user});
});

// UPDATE /users/:id
router.put("/:id", middleware.checkProfileOwnership, function(req, res) {
	User.findByIdAndUpdate(req.params.id, req.body.user, function(err, user) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/users/"+req.params.id);
		}
	});
});

// GET /users/:id/changePassword
router.get("/:id/changePassword", middleware.checkProfileOwnership, function(req, res) {
	res.render("users/change");
});

// PUT /users/:id/changePassword

// user.changePassword is an asynchronous function, so any error thrown in it has be passed to 
// next, i.e., next(err) so that express can handle it.
router.put("/:id/changePassword", middleware.checkProfileOwnership, function(req, res, next) {
	User.findById(req.params.id, function(err, user) {
		if (err) {
			req.flash("error", "something went wrong");
			return res.redirect("/campgrounds");
		}
		
		if (req.body.newPassword === req.body.confirm) {
			user.changePassword(req.body.oldPassword, req.body.newPassword, function(err, result) {
				if (err) {
					req.flash("error", err.message);
					res.redirect("back");
					return next(err);
				} else {
					req.flash("success", "Successfully changed password for");
					res.redirect("/campgrounds");
				}
			});
		} else {
			req.flash("error", "Passwords do not match");
			// res.render("users/change");
			return res.redirect("back");
		}
	});
});

module.exports = router;