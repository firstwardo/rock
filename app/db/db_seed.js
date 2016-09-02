var db = require('./database_variables');
var misc = require('../utilities/misc_functions');

console.log("SEEDING...");

var ROOT_USERNAME = "root";
var ROOT_PASSWORD = "pootis";
var GLOBAL_ANON_USERNAME = "anonymous";
var GLOBAL_ANON_PASSWORD = "anonymous";

// db.User.find(function (err,users) {
// 	console.log(users);
// });

db.User.remove({}, function (err, res) {});
// db.Playlist.remove({}, function (err, res) {});
// db.Song.remove({}, function (err, res) {});


// Add the root user.

var rootCallback = function(hash, salt) {
	var newUser = new db.User({ username: ROOT_USERNAME, hash: hash, salt: salt });
	newUser.save(newUser, function (err) {
		if (err) {
			console.log("Could not create the root user (in seed.js):");
			console.log(err);
		} else {
			console.log("Created root user.");
		}
	});
};
misc.newCryptoPassword(ROOT_PASSWORD, rootCallback);

// Add global anon user.

var anonCallback = function(hash, salt) {
	var newUser = new db.User({ username: GLOBAL_ANON_USERNAME, hash: hash, salt: salt });
	newUser.save(newUser, function (err) {
		if (err) {
			console.log("Could not create the root user (in seed.js):");
			console.log(err);
		} else {
			console.log("Created global anonymous user.");
		}
	});
};
misc.newCryptoPassword(GLOBAL_ANON_PASSWORD, anonCallback);


// Put some songs in our DB.

/*var newSongs = [
	{ source: "SEED", metadata: { title: "Lol", artist: "artist_id" }, uri: "XlRyk9gfkvw" },
	{ source: "SEED", metadata: { title: "Money", artist: "artist_id" }, uri: "ADa7n1fM12g" },
];

db.Song.collection.insert(newSongs, function (err) {
	if (err) {
		console.log("Could not add songs (in seed.js):");
		console.log(err);
	} else {
		console.log("Added songs.");
		
		// Give the root user some playlists

		db.Song.find({}, function (err, allSongs) {

			newPlaylists = [
				{ name: "One-Song", owner: "root", songIdentifierList: [allSongs[0]._id] },
				{ name: "Two-Songs", owner: "root", songIdentifierList: allSongs.map(function (songIdentifier) { return songIdentifier._id; })}
			];

			db.Playlist.collection.insert(newPlaylists, function (err) {
				if (err) {
					console.log("Could not add playlists (in seed.js):");
					console.log(err);
				} else {
					console.log("Added playlists.");
				}
			});
		});
	}
});*/