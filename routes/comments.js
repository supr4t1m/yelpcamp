var express  = require("express"),
	router   = express.Router({mergeParams: true}),
	middleware = require("../middleware"),
	Campground = require("../models/campgrounds"),
	Comment = require("../models/comments");

//============================
//COMMENTS ROUTES
//============================

//NEW route

router.get("/new",middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});	
		}
	});
});

//CREATE route

router.post("/", middleware.isLoggedIn, function(req, res) {
	Campground.findById(req.params.id, function(err, campground) {
		if(err) {
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if(err) {
					console.log(err);
				} else {
					//add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					//save comment
					comment.save();
					req.flash("success", "Successfully added a comment.");
					campground.comments.push(comment);
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			});
		}
	});
});

//EDIT route 

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if(err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//UPDATE route 
 
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if(err) {
			res.redirect("back");
		} else {
			req.flash("success", "successfully updated comment");
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//DELETE route 
 router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	 Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		 if(err) {
			 req.flash("error", "Could not delete the comment.");
			 res.redirect("back");
		 } else {
			 req.flash("success", "successfully deleted comment.")
			 res.redirect("/campgrounds/"+req.params.id);
		 }
	 });
 });








module.exports = router;