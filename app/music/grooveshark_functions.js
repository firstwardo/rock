var GS = require("grooveshark");
var gs = new GS('mash_westegg', '5f2505414b259dce41f5f4b2211d95d3');
exports.country = "0xdeadbeef";
exports.login = function(username,password,cookie,callback){
	var gs = new GS('mash_westegg', '5f2505414b259dce41f5f4b2211d95d3');
		gs.authenticate(username,password,cookie, function(err) {
			if(err){
				callback('wrong shit');
			}
			else{
				callback('done!');
			}
		});
}

exports.search = function (query,type) {
	var gsresults = [];
		var country = null;
		gs.authenticate('firstwardo@yahoo.com', 'pootisman69',null, function(err) {
			gs.request('getCountry', {}, function(err, status, body) {
				if(err) {
					console.log(err);
					console.log("Grooveshark ERROR");
				}
				country = body;
				exports.country = body;
				switch(type){
					case "track":
						gs.request('getSongSearchResults', { query: query, country: country }, function(err, status, body) {
							for (i = 0; i < body.songs.length; i++) {
								var song = body.songs[i];
								gsresults.push(obj.songObject('grooveshark',song.SongName,song.ArtistName,song.AlbumName,null,song.CoverArtFilename,song.Popularity,null,song.SongID,null));
							}
							callback(gsresults,'grooveshark');
						});
						break;
					case "album":
						gs.request('getAlbumSearchResults', { query: query, country: country }, function(err, status, body) {
							for (i = 0; i < body.albums.length; i++) {
								var album = body.albums[i];
								gsresults.push(obj.albumObject('grooveshark',album.AlbumName,album.CoverArtFilename,album.ArtistName,null,album.AlbumID,null));
							}
							callback(gsresults,'grooveshark');
						});
						break;
					case "artist":
						gs.request('getArtistSearchResults', { query: query, country: country }, function(err, status, body) {
							for (i = 0; i < body.artists.length; i++) {
								var artist = body.artists[i];
								gsresults.push(obj.artistObject('grooveshark',artist.ArtistName,null,artist.ArtistName,null,artist.ArtistID,null));
							}
							callback(gsresults,'grooveshark');
						});
						break;
					default:
						gs.request('getSongSearchResults', { query: query, country: country }, function(err, status, body) {
							for (i = 0; i < body.songs.length; i++) {
								var song = body.songs[i];
								gsresults.push(obj.songObject('grooveshark',song.SongName,song.ArtistName,song.AlbumName,null,song.CoverArtFilename,song.Popularity,null,song.SongID,null));
							}
							callback(gsresults,'grooveshark');
						});
				}
		});
	});
}

exports.loadSong = function (songID, callback) {
	gs.request('getStreamKeyStreamServer', { songID: songID, country: exports.country }, function (err, status, body) {
		callback(body);
	});
}

exports.setSessionId = function(sessionid,cookie){
	callback = function(user){
		db.users.update({_id:user.username}, {$set: {'user.grooveshark.sessionId':sessionid}},function(err){});
	}
	misc.getCurrentUser(cookie,callback);
}