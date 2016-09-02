request = require('request');
var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var userActions = require("../route_handlers/user_actions");
var playlistActions = require("../route_handlers/playlist_actions");
var songActions = require("../route_handlers/song_actions");

var spotify = require('../music/spotify_functions');

// ROUTES


// API test route---------------------------------
router.get('/', function (req, res) {
	res.send(ROCK_STATUS(200), {"data": "Connected to backend API. Welcome! I love you."})
});


// Service Callback Routes------------------------
router.get("/auth_callback/spotify", function (req, res) {
	spotify.authCodeCallback(req, res);
});


// User routes------------------------------------
router.get('/user',function (req,res) {
	userActions.getInfo(req, res);
});

// router.put('/user',function (req,res) {
// 	userActions.register(req.body.username, req.body.password, res);
// });

router.post('/user',function (req, res) {
	userActions.login(req.body.username, req.body.password, req, res);
});

// Need to be logged in to do the below actions...

router.use(function (req, res, next) {
	if (req.session.activeUser === undefined || req.session.activeUser == null) {
		res.send(ROCK_STATUS(401), {error: "Please login to search music, logout, open queues or make playlists."});
	} else {
		next();
	}
});

// Don't even try to anything below this line unless you're authed.
//
//		||
//		||
//		||
//    \ || /
//	   \||/
//      \/
//

router.delete('/user',function (req, res) {
	userActions.logout(req, res);
});


// router.get('/authedApps',function(req,res){
// 	var apps = {};
// 	callback = function(user){
// 		if (user.soundcloud.accesstoken != null) {
// 			apps.soundcloud = true;
// 		}
// 		if (user.youtube.accesstoken != null) {
// 			apps.youtube = true;
// 		}
// 		if (user.grooveshark.sessionid != null) {
// 			apps.grooveshark = true;
// 		}
// 		if (user.spotify.username != null) {
// 			apps.spotify = true;
// 		}
// 		res.send(apps);
// 	}
// 	misc.getCurrentUser(req.cookies.loginToken,callback);
// });

// router.get('/load_gs_song',function (req,res) {
// 	grooveshark.loadSong(req.query.songID, function (data) {
// 		res.send(data);
// 	});
// });

//Callbacks-------------------------------------------------------------------------------------------------
// router.get('/callback/sc',function (req,res){
// 	soundcloud.login(req.query.code,req.cookies.loginToken);
// 	console.log(req.cookies.loginToken);
// 	res.redirect('/');
// })
// router.get('/callback/yt', function(req,res){
// 	youtube.login(req.cookies.loginToken, req.query.code);
// 	res.redirect('/');
// });

//Service Login------------------------------------------------------------------------------------------------------------------
// router.get('/login/youtube', function (req,res){
// 	var string = querystring.stringify({
// 		client_id: app.data.youtube.clientId,
// 		redirect_uri: app.data.youtube.redirectUri,
// 		response_type: 'code',
// 		scope: 'https://www.googleapis.com/auth/youtube',
// 		access_type: 'offline',
// 	});
// 	res.redirect('https://accounts.google.com/o/oauth2/auth?'+string);
// });
// router.get('/login/soundcloud', function (req,res){
// 	var string = querystring.stringify({
// 		client_id: app.data.soundcloud.clientId,
// 		redirect_uri: app.data.soundcloud.redirectUri,
// 		response_type: 'code',
// 		scope: 'non-expiring',
// 	});
// 	res.redirect('https://soundcloud.com/connect?'+string);
// });
// router.post('/login/grooveshark', function (req,res){
// 	callback = function(responseText){
// 		res.send(responseText);
// 	}
// 	grooveshark.login(req.body.username,req.body.password,req.cookies.loginToken,callback);
// });
// router.post('/login/spotify', function(req,res){
// 	callback = function(responseText){
// 		res.send(responseText);
// 	}
// 	spotify.login(req.body.username,req.body.password,req.cookies.loginToken,callback);
// });


// Playlist routes------------------------------------
router.get('/playlist', function (req, res) {
	playlistActions.getPlaylists(req,res);
});

router.put('/playlist', function (req, res) {
	playlistActions.newPlaylist(req,res);
});

router.delete('/playlist', function (req, res) {
	playlistActions.deletePlaylists(req, res);
});


// Song routes------------------------------------
router.get('/songs', function (req, res) {
	songActions.getSongs(req,res);
});

router.get('/search',function (req,res) {
	songActions.search(req, res);
});


// Service Playlist Grabbers------------------------
router.put('/spotify/login',function (req,res) {
	callback = function(responseText){
		res.send(responseText);
	};
	spotify.login(req.body.username,req.body.password,req.cookies.loginToken,callback);
});

// router.get('/soundcloud/playlist', function(req,res){
// 	callback = function(response){
// 		res.send(response);
// 	}
// 	soundcloud.getPlaylist(req.cookies.loginToken,callback);
// });
// router.post('/spotify/getPlaylist', function(req,res){
// 	callback = function(response){
// 		res.send(response);
// 	}
// 	spotify.getPlaylist(req.body.url,callback);
// });
// router.get('/spotify/getMyPlaylists', function(req,res){
// 	callback = function(response){
// 		res.send(response);
// 	}
// 	spotify.getMyPlaylists(req.cookies.loginToken,callback);
// });
// router.post('/spotify/lookupTracks', function(req,res){
// 	callback = function(array){
// 		res.send(array);
// 	}
// 	spotify.lookupTracks(req.body.playlist.tracks,callback);
// });


module.exports = router;
