var Campground = require("../models/campgrounds"),
	Comment = require("../models/comments"),
	User 	= require("../models/user");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground) {
			if(err) {
				req.flash("error", "campground not found.");
				res.redirect("back");
			} else {
				if(foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that.");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You must be logged in.")
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if(req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err) {
				res.redirect("back");
			}
			if(foundComment.author.id.equals(req.user._id)) {
				next();
			} else {
				req.flash("error", "You don't have permission to do that.");
				res.redirect("back");
			}
		});
	} else {
		req.flash("error", "You must be logged in.")
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You must be logged in.");
	res.redirect("/login");
}

middlewareObj.checkProfileOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		User.findById(req.params.id, function(err, user) {
			if (err) 
				res.redirect("/campgrounds");
			
			if (user.id === req.user.id) 
				next();
			else {
				req.flash("error", "You don't have permission to do that");
				res.redirect("/campgrounds");
			}
		});
	} else {
		req.flash("error", "You must be logged in.");
		res.redirect("/login");
	}
}

module.exports = middlewareObj;