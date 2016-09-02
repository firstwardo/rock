exports.getPlaylists = function (req, res) {
	db.Playlist.find({ owner: req.session.activeUser.username }, function (err, playlists) {
		if (err) {
			res.send(ROCK_STATUS(500), {"error": "Database error; could not read your playlists."});
		} else {
			res.send(ROCK_STATUS(200), {"data": playlists});
			console.log({"data": playlists});
		}
	});
}

exports.deletePlaylists = function(req, res) {
	db.Playlist.find({ "_id": { $in: req.query.playlists }}, function (err, playlists) {
		if (err) {
			res.send(ROCK_STATUS(500), {"error": "Database error; could not read playlists."});
			return;
		} else if (playlists.length == 0) {
			res.send(ROCK_STATUS(404), {"error": "Playlist not found. Cannot delete."});
			return;
		}
	}).remove(function (err) {
		if (err) {
			res.send(ROCK_STATUS(500), {"error": "Database error; could not delete playlist."});
		} else {
			res.send(ROCK_STATUS(200), {"data": "Playlist deleted."});
		}
	});
}

exports.newPlaylist = function (req,res) {
	var newPlaylist = { name: req.body.name, owner: req.session.activeUser.username, songIdentifierList: req.body.songIdentifierList }
	db.Playlist.collection.insert(newPlaylist, function (err) {
		if (err) {
			res.send(ROCK_STATUS(500), {"error": "Database error; could not save your playlist. (Try logging in again.)"});
			console.log("Could not add playlists (from PUT request):");
			console.log(err);
		} else {
			res.send(ROCK_STATUS(200), {"data": "Saved."});
			console.log("Added playlists.");
		}
	});
}