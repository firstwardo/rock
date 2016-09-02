var googleapis = require('googleapis');


exports.login = function(cookie, code){
	request.post('https://accounts.google.com/o/oauth2/token',{form: {grant_type:'authorization_code',code: code,client_secret:app.data.youtube.clientSecret,client_id: app.data.youtube.clientId, redirect_uri: app.data.youtube.redirectUri}}, function(err,res2,body){
		var data = JSON.parse(body)
		expiresIn = (parseInt(data.expires_in)-5)*1000;
		callback = function(user){
			db.users.update({_id:user.username}, {$set: {'user.youtube.accesstoken':data.access_token,'user.youtube.refreshtoken':data.refresh_token,'user.youtube.expiresin':expiresIn}},function(err){
				initRefresh(user.username,data.refresh_token);
			});
		}
		misc.getCurrentUser(cookie,callback);
	});
}
exports.refresh = function(username, refreshToken){
	request.post('https://accounts.google.com/o/oauth2/token',{form: {grant_type:'refresh_token',refresh_token: refreshToken,client_secret:app.data.youtube.clientSecret,client_id: app.data.youtube.clientId}}, function(err,res2,body){
		var data = JSON.parse(body);
		expiresIn = (parseInt(data.expires_in)-5)*1000;
		db.users.update({_id:user.username}, {$set: {'user.youtube.accesstoken':data.access_token,'user.youtube.refreshtoken':data.refresh_token,'user.youtube.expiresin':expiresIn}},function(err){
			console.log('Refreshed Youtube for '+username);
		});
	});

}
exports.search = function (query, type, callback) {
	var ytresults = [];
	var params = {
		part: 'snippet',
		maxResults: 25,
		order: 'relevance',
		q: query,
		type: 'video',
		videoCategoryId: '10',
		auth: app.data.youtube.serverId,
	};
		
	googleapis.youtube('v3').search.list(params, function (err, response) {
		if (err) {
			console.log("Go ahead and whitelist your IP address.".red);
			console.log(err);
			callback([],'youtube');
			return;
		}

		for (i = 0; i<response.items.length; i++) {
			var song = response.items[i];
			ytresults.push(obj.songObject('youtube',song.snippet.title,song.snippet.channelTitle,null,null,song.snippet.thumbnails.default,null,song.snippet.publishedAt,song.id.videoId,null));
		}
		callback(ytresults,'youtube');
	});
}
function initRefresh(username,refreshToken,expiresIn){
	//setInterval(youtube.refresh,expiresIn,username,refreshToken);
}
