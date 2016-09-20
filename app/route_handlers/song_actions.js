var grooveshark = require('../music/grooveshark_functions');
var youtube = require('../music/youtube_functions');
var soundcloud = require('../music/soundcloud_functions');
var Parser = require('../music/general_functions');
var internetAccess = require('../utilities/internet_access');

exports.searchResults = [];
exports.openReqs = 0;

exports.getSongs = function (req, res) {
	db.Song.find({ "_id": { $in: req.query.songs }}, function (err, songs) {
		if (err) {
			res.send(ROCK_STATUS(500), {"error": "Database error; could not read songs."});
		} else {
			res.send(ROCK_STATUS(200), {"data": songs});
			console.log({"data": songs});
		}
	});
};

exports.getAllSongs = function (req, res) {
	db.Song.find({}, function (err, songs) {
		if (err) {
			res.send(ROCK_STATUS(500), {"error": "Database error; could not read songs."});
		} else {
			if (songs.length == 0) {
				Console.log("No songs in DB.")
			}
			res.send(ROCK_STATUS(200), {"data": songs});
			console.log({"data": songs});
		}
	});
};

exports.combineResultsIfRequested = function (req, searchResults) {
	if (req.query.combine == "yes") {
		Parser.setup(searchResults);
		Parser.parseSongs();
		temp = Parser.fetchResults();
		searchResults = temp.sort(function(a,b){return a.metadata.title < b.metadata.title ? -1 : 1});
	} else {
		temp = [];
		for (i = 0; i < searchResults.length; i++) {
			for (j = 0; j < searchResults[i].length; j++) {
				temp.push(searchResults[i][j]);
			}
		}
		searchResults = temp.sort(function(a,b){return a.metadata.title < b.metadata.title ? -1 : 1});
	}
};

exports.classifySearchResults = function (res, searchResults, callbackOnFinishClassifying) {
	duplicateResults = [];
	newResults = [];
	var songsToProcess = searchResults.length;
	searchResults.forEach(function (song) {
		console.log("Classifying song as new or duplicate...");
		db.Song.findOne({uri: song.uri}, function (err, existingSong) {
			if (err) {
				res.send(ROCK_STATUS(500), {"error": "Databse error; cannot lookup songs in DB."});
			} else {
				if (existingSong != null) {
					console.log("Was a dup.");
					duplicateResults.push(existingSong);
				} else {
					console.log("Was new.");
					newResults.push(song);
				}
				if (--songsToProcess == 0) {
					console.log(songsToProcess);
					callbackOnFinishClassifying(newResults, duplicateResults);
				}
			}
		});
	});
};

exports.searchResultCallback = function (req, res, results) {
	exports.searchResults.push(results);
	console.log("Requesting...");
	if (--exports.openReqs == 0) {
		console.log("Requests complete...");

		// Now that all reqs have completed, parse & pack songs into results array
		exports.combineResultsIfRequested(req, results);
		
		// We have the results array. We need to add new songs to the DB.
		// If there are no search results, return the empty array.
		if (exports.searchResults.length == 0) {
			console.log("No results.");
			res.send(ROCK_STATUS(200), { "data": [] });
			return;
		}

		// Now that we have all the songs from the DB, we can decide if each search
		// result is in the database or not. If it is in the DB, add it to dup results.
		// If not, add it to new results.
		exports.combineResultsIfRequested(req, results);

		// Otherwise, insert new songs into the DB and return them along with
		// the array of dupes.
		exports.classifySearchResults(res, results, function (newResults, duplicateResults) {
			console.log("Saving results to DB...");

			// If we have no new results, just send back the array of duplicates.
			if (newResults.length == 0) {
				console.log("Sending back only dupes...");
				res.send(ROCK_STATUS(200), { "data": duplicateResults });
				return;
			}

			// Otherwise, save new songs and return everything.
			db.Song.collection.insert(newResults, function (err) {
				if (err) {
					res.send(ROCK_STATUS(500), { "error": "Database error; could not add search results to DB."})
				} else {
					console.log("Sending back a mix of new and old, or just new...");
					var allResults = [];
					newResults.forEach(function (song) {
						allResults.push(song);
					});
					duplicateResults.forEach(function (song) {
						allResults.push(song);
					});
					console.log(allResults);
					res.send(ROCK_STATUS(200), { "data": allResults });
				}
			});
		});
	}
};

exports.search = function (req, res) {
	if (!internetAccess.connected()) {
		res.send(ROCK_STATUS(500), {"error": "Server cannot access internet."});
		return;
	}
	var callback = function (results) {
		exports.searchResultCallback(req, res, results);
	}

	exports.openReqs = 4;
	exports.searchResults = [];
	console.log("Searching...");
	switch (req.query.s) {
		/*case "soundcloud":
			soundcloud.search(req.query.q,req.query.t,callback);
			exports.openReqs = 1;
			break;
		case "spotify":
			spotify.search(req.query.q,req.query.t,callback);
			exports.openReqs = 1;
			break;
		case "youtube":
			youtube.search(req.query.q,req.query.t,callback);
			exports.openReqs = 1;
			break;*/
		default:
			openReqs = 1;
			soundcloud.search(req.query.q,req.query.t,callback);
			//spotify.search(req.query.q,req.query.t,callback);
 		   	//youtube.search(req.query.q,req.query.t,callback);
	}
}
