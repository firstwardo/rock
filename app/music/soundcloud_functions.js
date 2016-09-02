request = require('request');

exports.search = function (query,type) {
	var scresults = [];
	switch (type) {
		case "track":
			request.get('https://api.soundcloud.com/tracks.json?client_id='+app.data.soundcloud.clientId+'&q='+query, function (err,res,body) {
				var data = JSON.parse(body);
				for (i=0;i<data.length;i++) {
					song = data[i];
					scresults.push(obj.songObject('soundcloud',song.title,song.user.username,song.label_name,song.genre,song.artwork_url,song.favoritings_count,song.release_year,song.id,song.permalink_url, song.duration));
				}
				callback(scresults,'soundcloud');
				
			});
			break;
		case "album":
			request.get('https://api.soundcloud.com/playlists.json?client_id='+app.data.soundcloud.clientId+'&q='+query, function (err,res,body) {
				var data = JSON.parse(body);
				for (i=0;i<data.length;i++) {
					var album = data[i];
					scresults.push(obj.albumObject('soundcloud',album.title,album.artwork_url,album.user.username,null,album.uri,album.permalink_url));
				}
				callback(scresults,'soundcloud');
			});
			break;
		case "artist":
			request.get('https://api.soundcloud.com/users.json?client_id='+app.data.soundcloud.clientId+'&q='+query, function (err,res,body) {
				var data = JSON.parse(body);
				for (i=0;i<data.length;i++) {
					var artist = data[i];
					scresults.push(obj.artistObject('soundcloud',artist.username,artist.avatar_url,artist.followers_count,artist.uri,artist.permalink_url));
				}
				callback(scresults,'soundcloud');
			});
			break;
		default:
			request.get('https://api.soundcloud.com/tracks.json?client_id='+app.data.soundcloud.clientId+'&q='+query, function (err,res,body) {
				var data = JSON.parse(body);
				for (i=0;i<data.length;i++) {
					var song = data[i];
					scresults.push(obj.songObject('soundcloud',song.title,song.user.username,song.label_name,song.genre,song.artwork_url,song.favoritings_count,song.release_year,song.id,song.permalink_url, song.duration));
				}
				callback(scresults,'soundcloud');
				
			});
	}
}

exports.login = function(code,cookie){
	callback = function(user){
		request.post('https://api.soundcloud.com/oauth2/token',{form: {grant_type:'authorization_code',code: code,client_secret:app.data.soundcloud.clientSecret,client_id: app.data.soundcloud.clientId, redirect_uri: app.data.soundcloud.redirectUri}}, function(err,res2,body){
			var data = JSON.parse(body);
				db.users.update({_id:user.username}, {$set: {'user.soundcloud.accesstoken':data.access_token}},function(err){
				});
			});
	}
	misc.getCurrentUser(cookie,callback);
}

exports.getPlaylist = function(cookie,callback){
	finalArray = [];
	openReqs = 2;
	backcall = function(){
		if(--openReqs == 0){
			callback(finalArray);
		}
	}
	usercallback = function(user){
		request.get('https://api.soundcloud.com/me/playlists.json?oauth_token='+user.soundcloud.accesstoken, function(err,res2,body){
			var data = JSON.parse(body);
			for(i=0;i<data.length;i++){
				var trackArray = [];
				for(x=0;x<data[i].tracks.length;x++){
					song=data[i].tracks[x];
					trackArray.push(obj.songObject('soundcloud',song.title,song.user.username,song.label_name,song.genre,song.artwork_url,song.favoritings_count,song.release_year,song.id,song.permalink_url,song.duration));
					
				}
				finalArray.push(obj.playlistObject(data[i].title, data[i].id, trackArray, 'soundcloud'));
				backcall();
			}
		});
		request.get('https://api.soundcloud.com/me/favorites.json?oauth_token='+user.soundcloud.accesstoken, function(err,res2,body){
			var data = JSON.parse(body);
			for(i=0;i<data.length;i++){
				var trackArray = [];
					song=data[i];
					trackArray.push(obj.songObject('soundcloud',song.title,song.user.username,song.label_name,song.genre,song.artwork_url,song.favoritings_count,song.release_year,song.id,song.permalink_url,song.duration));
				}
				finalArray.push(obj.playlistObject('Favorites', 'Favorites', trackArray, 'soundcloud'));
				backcall();
		});
	}
	misc.getCurrentUser(cookie,usercallback);
}