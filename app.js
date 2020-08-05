require("dotenv").config();

var express 		= require('express'),
	app 			= express(),
	bodyParser 		= require('body-parser'),
	mongoose 		= require('mongoose'),
	methodOverride	= require("method-override"),
	flash			= require("connect-flash"),
	passport		= require("passport"),
	localStrategy	= require("passport-local"),
	Campground 		= require("./models/campgrounds"),
	Comment 		= require("./models/comments"),
	User 			= require("./models/user"),
	seedDB			= require("./seeds");

// requiring route modules

var campgroundsRoutes = require("./routes/campgrounds"),
	commentsRoutes	  = require("./routes/comments"),
	indexRoutes		  = require("./routes/index");
	// campgrounds = [
	// 	{name:'Salmon Greek', image:'https://th.bing.com/th/id/OIP.8fVlBBHp73Neid3I9Aj82AHaFj?w=212&h=180&c=7&o=5&dpr=1.25&pid=1.7'},
	// 	{name:'Granite Hill', image:'https://th.bing.com/th/id/OIP.iezcBRbEEDRNQHDu0ibozQHaDb?w=308&h=162&c=7&o=5&dpr=1.25&pid=1.7'},
	// 	{name:"Mountain goat's rest", image:'https://th.bing.com/th/id/OIP.ifjgRwGw_0cKbBU5im0bXQHaEK?w=316&h=180&c=7&o=5&dpr=1.25&pid=1.7'}
	// ]

mongoose.connect("mongodb+srv://the_nerd:"+process.env.MONGO_PASS+"@cluster0.oebvw.mongodb.net/yelpcamp_deployed?retryWrites=true&w=majority", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false
})
.then(()=>console.log("Connected to DB"))
.catch((err)=>console.log(err));

// seedDB();  //seed the database;

//PASSPORT configuration
app.use(require("express-session") ({
	secret: "It's a secret",
	resave: false,
	saveUninitialized: false
}));
//=======================
// var geocoding = require("@mapbox/mapbox-sdk/services/geocoding"),
// 	geocodingServices = geocoding({accessToken: 'pk.eyJ1IjoidGhleHhuZXJkIiwiYSI6ImNrZGJrb3MwNTBvdnMycW16Zzk1ZWFib20ifQ.-pfp-gkL82k2yx4Hj0KKfA'});
// 	geocodingServices.forwardGeocode({
// 		query: "paris",
// 		limit: 1
// 	})
// 	.send()
// 	.then(response=>console.log(response.body.features[0].center))
// 	.catch(err=>console.log(err));
//==============================

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);
app.use(indexRoutes);

app.listen(process.env.PORT||3000, process.env.IP, function() {
	console.log('The Yelpcamp server has started');
});