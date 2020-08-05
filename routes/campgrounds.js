var express = require("express"),
	router  = express.Router(),
	middleware = require("../middleware"),
	Campground = require("../models/campgrounds"),
	geocoding = require("@mapbox/mapbox-sdk/services/geocoding"); //requires the mapbox-sdk geocoding services 																	//client

//for more information goto https://github.com/mapbox/mapbox-sdk-js/tree/master

	

//INDEX - show all items
router.get('/', function(req, res) {
	Campground.find({}, function(err, allCampgrounds) {
		if(err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', {campgrounds: allCampgrounds});
		}
	});
});

//CREATE - add new items to DB
router.post('/', middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var location = req.body.location;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price: price, image: image, location: location, description: description, author: author};
	Campground.create(newCampground, function(err, newOne) {
		if(err) {
			console.log(err);
		} else {
			res.redirect('/campgrounds');

		}
	})
});

//NEW - show the form to submit
router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('campgrounds/new');
})

//SHOW - show more about the selected item
router.get('/:id', function(req, res) {
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err) {
			console.log(err);
		} else {
		var geocodingServices = geocoding({accessToken: process.env.GEOCODER_API_KEY}); //this exposes services such as forward and reverse geocoding;
			geocodingServices.forwardGeocode({			//fires a mapirequest with location and limit of responses;
				query: foundCampground.location,	//returns a promise which is resolved either by mapiresponse or
				limit: 1							//mapierror
			})
			.send()			//sends the mapirequest(map-api-request);
			.then(response=>{		//deals with mapiresponse
				console.log(response.body.features[0].center),
				res.render('campgrounds/shows', {campground: foundCampground, 
												 center: response.body.features[0].center});	
			})
			.catch(err=>console.log(err));   //catches the mapierror
		}
	});
});

//EDIT route

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.render("campgrounds/edit", {campground: foundCampground});
		}
	});
});

//UPDATE route

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	//find and update the campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground) {
		if(err) {
			res.redirect("/campgrounds")
		} else {
			res.redirect("/campgrounds/"+ req.params.id);
		}
	});
});

//DESTROY route 
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});


module.exports = router;