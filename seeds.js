var mongoose = require("mongoose"),
	Campground = require("./models/campgrounds"),
	Comment = require("./models/comments")
	data = [
		{
			name: 'Granite Hill',
			image: 'https://th.bing.com/th/id/OIP.iezcBRbEEDRNQHDu0ibozQHaDb?w=308&h=162&c=7&o=5&dpr=1.25&pid=1.7',
			description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec consectetur aliquet enim eget mollis. Mauris vitae enim vitae erat pellentesque rutrum. Quisque egestas turpis et nulla tincidunt, vitae commodo tortor sodales. Maecenas vitae erat id ligula commodo rutrum nec in est. Quisque tincidunt tincidunt turpis, eget lacinia velit iaculis id. Duis nibh odio, vestibulum in tincidunt vitae, ullamcorper eu erat. Aenean vitae lacus imperdiet, fermentum tellus euismod, aliquet arcu. Curabitur eget lorem posuere, elementum ante quis, consequat arcu.'
		},
		{
			name:'Salmon Greek', 
			image:'https://th.bing.com/th/id/OIP.8fVlBBHp73Neid3I9Aj82AHaFj?w=212&h=180&c=7&o=5&dpr=1.25&pid=1.7',
			description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras sit amet faucibus neque, id hendrerit dolor. Donec tempor hendrerit felis, vitae pretium enim volutpat non. Duis finibus lacus vitae condimentum euismod. Vivamus a sem vulputate, iaculis nunc et, tempus purus. Ut sem tortor, placerat eu leo vitae, condimentum laoreet enim. Phasellus vitae viverra nisl. Curabitur sollicitudin vulputate urna eget dapibus. Suspendisse tristique molestie ante, et auctor nibh tempor in. Ut ac enim hendrerit, eleifend orci vitae, feugiat dolor. Donec in velit rutrum, mollis lectus quis, consequat lacus. Fusce ornare tempor placerat. Mauris mollis erat a ante consectetur tempor. Aliquam erat volutpat. Vivamus dapibus blandit massa, et luctus lectus posuere sed. Suspendisse auctor et leo vitae ornare."
		},
		{
			name:"Mountain goat's rest", 
			image:'https://th.bing.com/th/id/OIP.ifjgRwGw_0cKbBU5im0bXQHaEK?w=316&h=180&c=7&o=5&dpr=1.25&pid=1.7',
			description: "Praesent sit amet leo ultricies, feugiat est vitae, maximus dui. Quisque accumsan mi consequat leo blandit maximus. Vestibulum convallis pellentesque semper. Morbi non vestibulum nisl. Duis sagittis bibendum luctus. Mauris a iaculis sem. Quisque efficitur nulla vitae nisl malesuada rhoncus. Vestibulum eget justo at eros mollis venenatis. Aliquam felis elit, vulputate quis hendrerit ut, pharetra at est. Aenean dapibus, arcu eget ullamcorper dictum, diam risus tempus erat, id vehicula lorem odio id leo. Interdum et malesuada fames ac ante ipsum primis in faucibus. In hac habitasse platea dictumst. In hac habitasse platea dictumst. Morbi at neque vel neque interdum mollis. Proin ac tempor nisi, nec tincidunt leo. Nulla sed eleifend mi."
		}
	]

function seedDB() {
	// Campground.deleteMany({}, function(err) {
	// 	if(err) {
	// 		console.log(err);
	// 	}
	// 	else {
	// 		console.log("Successfully removed from database");
	// 	}
	// 	data.forEach(function(seed) {
	// 		Campground.create(seed, function(err, campground) {
	// 			if(err) {
	// 				console.log(err);
	// 			} else {
	// 				console.log("added a campground");
	// 				Comment.create({
	// 					text: "This place is great, but I wish there was internet!",
	// 					author: "Homer"
	// 				}, function(err, comment) {
	// 					if(err) {
	// 						console.log(err);
	// 					} else {
	// 						campground.comments.push(comment);
	// 						campground.save();
	// 						console.log("Created a comment.")
	// 					}
	// 				});
	// 			}
	// 		});
	// 	});
	// });
}

module.exports = seedDB;