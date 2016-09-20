var Spotify = require('spotify-web');
var SWA = require('spotify-web-api-node');
var querystring = require('querystring');
var request = require('request');
var session = null;
exports.search = function(query,type,callback) {
	var type = type || "track";
	var spresults = [];
	var url = 'https://ws.spotify.com/search/1/'+type+'?q='+query
	/*db.spotifyCache.findOne({_id: url}, function(err, cache){
		if(cache){
			var options = {
		    	url: url,
		    	headers: {
		    		'Accept': 'application/json',
		    		'If-Modified-Since': cache.lastModified
		    	}
			};
			request.get(options, function (err,res,body) {
				if(res.statusCode == 304){
					console.log('Got spotify cache');
					callback(cache.results, 'spotify');
				}
				else{
					console.log('Spotify cache expired');
					parseResults(body);
					callback(spresults, 'spotify');
				}
			});
		}
		else{*/
			var options = {
		    	url: url,
		    	headers: {
		    		'Accept': 'application/json'
		    	}
			};
			request.get(options, function (err,res,body) {
				if (err) {
					console.log("SPOTIFY ERR");
					console.log(err);
				}
				parseResults(body);
				/*db.spotifyCache.save({_id: url, results: spresults, lastModified: res.headers['last-modified']}, function(err){

				});*/
				callback(spresults, 'spotify');
			//});
		//}
	});
	function parseResults(body){
		data = JSON.parse(body);
		switch(type) {
			case 'track':
				for (i=0;i<data.tracks.length;i++) {
					var song = data.tracks[i];
					spresults.push(obj.songObject('spotify',song.name,song.artists[0].name,song.album.name,null,null,song.popularity,song.album.released,song.href,null));
				}
				break;
			case 'album':
				for (i=0;i<data.albums.length;i++) {
					var album = data.albums[i];
					spresults.push(obj.albumObject('spotify',album.name,null,album.artists[0].name,album.popularity,album.href,null));
				}
				break;
			case 'artist':
				for (i=0;i<data.artists.length;i++) {
					var artist = data.artists[i];
					spresults.push(obj.artistObject('spotify',artist.name,null,artist.popularity,artist.href,null));
				}
				break;
			default:
				for (i=0;i<data.tracks.length;i++) {
					var song = data.tracks[i];
					spresults.push(obj.songObject('spotify',song.name,song.artists[0].name,song.album.name,null,null,song.popularity,song.album.released,song.href,null));
				}
		}
	}
}

exports.authCodeCallback = function (req, res) {
	if (req.query.code != undefined && req.query.code != null) {
		request.post("https://accounts.spotify.com/api/token", {grant_type: "authorization_code", code: req.query.code, redirect_uri:""})
		
		var form = {
			grant_type: "authorization_code",
			code: req.query.code,
			redirect_uri: "http://ec2-52-6-238-12.compute-1.amazonaws.com:5000/api/auth_callback/spotify",
		};

		var formData = querystring.stringify(form);
		var contentLength = formData.length;

		request({
			headers: {
				'Content-Length': contentLength,
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': "Basic "+(new Buffer("5b9b18c0d9f7473d9840a2b3d8d8d3b0:b8e8dbfa5ad54e8ab4bc3c7d1bf069aa").toString('base64')),
			},
			uri: 'https://accounts.spotify.com/api/token',
			body: formData,
			method: 'POST'
		}, function (err, inner_res, body) {
			console.log(body);
    		if (err) {
    			res.send(ROCK_STATUS(500), { error: "Couldn't get token from spotify." });
    		} else {
    			res.send(ROCK_STATUS(200), "Logged in! Switch back to the music player and hit the 'Continue' button.");
    		}
		});
	} else {
		res.send(ROCK_STATUS(500), { error: req.query.error });
	}
};

exports.getPlaylist = function(url,callback){
	if(session == null){
		Spotify.login('songbox69', 'deliciouspootis', function(err, ses){
			console.log(err);
			session = ses;
			get();
		});
	}
	else{
		get();
	}
	function get(){
		session.playlist(url, function(err, result){
			var tempArray = [];
			for(i=0;i<result.contents.items.length;i++){
				tempArray.push(result.contents.items[i].uri);
			}
			console.log(err);
				var openReqs = result.contents.items.length-1;
				trackcallback = function(trackArray){
						callback(obj.playlistObject(result.attributes.name,url,trackArray, 'spotify'));
				}
				spotify.lookupTracks(tempArray, trackcallback);
		});
	}
}

exports.login = function(username,password,cookie,callback){
	Spotify.login(username,password, function(err, ses){
		if(err){
			console.log(err);
			callback('Error!');
		}
		else{
			usercallback = function(user){
				db.users.update({_id:user.username}, {$set: {'user.spotify.username':username, 'user.spotify.password':password}},function(err){
				});
				callback("You have logged into Spotify");
			}
			misc.getCurrentUser(cookie,usercallback);
		}
		
	});
}

exports.getMyPlaylists = function(cookie,callback){
	usercallback = function(user){
		var username = user.spotify.username;
		var password = user.spotify.password;
		var playlistArray = [];
		Spotify.login(username,password, function(err, ses){
			ses.rootlist(function(err, result){
				console.log(err);
				var openReqs = result.contents.items.length-1;
				lookupcallback = function(playlistObject){
					playlistArray.push(playlistObject);
					if(--openReqs==0){
						callback(playlistArray);
					}
				}
				for(var i=0;i<result.contents.items.length;i++){
					if(result.contents.items[i].uri.search('starred')== -1){
						lookupMyPlaylists(ses, result.contents.items[i].uri, lookupcallback);
					}
					else{
						openReqs--;
					}
				}
				
			});
		});
	}
	misc.getCurrentUser(cookie,usercallback);
}

function lookupMyPlaylists(ses, url,callback){
	ses.playlist(url, function(err, result){
		console.log(err);
		var trackArray = [];
		for(var x=0;x<result.contents.items.length;x++){
			trackArray.push(result.contents.items[x].uri)
		}
		callback(obj.playlistObject(result.attributes.name,url,trackArray, 'spotify'));
	});
}
exports.lookupTracks = function(tracks,callback){
	var trackArray = [];
	var openReqs = tracks.length-1;
	searchCallback = function(songObject){
		trackArray.push(songObject);
		if(--openReqs==0){
			callback(trackArray);
		}
	}

	for(i=0;i<tracks.length;i++){
		var playlist = tracks[i];
		if(playlist.search('spotify:local')== -1){
			checkCache(playlist);
		}
		else{
			openReqs--;
		}
	}
}

function checkCache(songUri){
	db.spotifyCache.findOne({_id: songUri}, function(err, cache){
		search(cache,songUri,searchCallback);
	});
}

function search(cacheObj,uri){
	var modified = null;
	if(cacheObj != null){
		modified = cacheObj.lastModified;
	}
	var options = {
    	url: 'http://ws.spotify.com/lookup/1/.json?uri='+uri,
    	headers: {
    		'Accept': 'application/json',
    		'If-Modified-Since': modified,
    	}
	}
	request.get(options, function (err,res,body) {
		if(res.statusCode == 304){
			console.log('Got spotify cache');
			searchCallback(cacheObj.results);
		}
		else{
			console.log('Spotify cache expired or not cached');
			var song = JSON.parse(body).track;
			var songObj = obj.songObject('spotify',song.name,song.artists[0].name,song.album.name,null,null,song.popularity,song.album.released,song.href,null);
			saveToCache(songObj, res.headers['last-modified']);
			searchCallback(songObj);
		}
	});

}
function saveToCache(songObject, lastModified){
	db.spotifyCache.save({_id:  songObject.uri, results: songObject, lastModified: lastModified}, function(err){
		if(err){
			console.log(err);
		}
	});
}
