/*var mongoDb = require('mongodb').Db;
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;

MongoClient.connect("mongodb://bob:pootisisdelicious@ds053390.mongolab.com:53390/betterrock", {native_parser:true}, function(err, db) {
	if(err){
		console.log(err);
	}
	else{
		exports.playlist = db.collection('playlist');
		exports.match = db.collection('match');
		exports.users = db.collection('users');
		exports.gmusic = db.collection('gmusic');
		exports.onlineUsers = db.collection('onlineUsers');
	}
});

MongoClient.connect("mongodb://bob:pootisisdelicious@ds045089.mongolab.com:45089/cache", {native_parser:true}, function(err, db) {
	if(err){
		console.log(err);
	}
	else{
		exports.spotifyCache = db.collection('spotify');
		exports.gmusicCache = db.collection('googlemusic');
	}
});
*/


// END OF THE MONGO ERA
// WELCOME THE MONGOOSE OVERLORDS
// YOUR NEW PROTECTORS

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/rock');
//mongoose.connect('mongodb://admin:admin@ds053439.mongolab.com:53439/heroku_app26769165');
//mongoose.connect('mongodb://bob:pootisisdelicious@ds045089.mongolab.com:45089/rock')

var UserSchema = new Schema({
	username: { type: String, required: true },
	hash: { type: String, required: true },
	salt: { type: String, required: true },
});

var PlaylistSchema = new Schema({
	name: { type: String, required: true },
	owner: { type: String, required: true },
	songIdentifierList: { type: Array, required: true },
});

var SongSchema = new Schema({
	source: { type: String, required: true },
	title: { type: String, required: true },
	artist: { type: String, required: true },
	uri: { type: String, required: true, unique: true },
});

module.exports.User = mongoose.model('User', UserSchema);
module.exports.Playlist = mongoose.model('Playlist', PlaylistSchema);
module.exports.Song = mongoose.model('Song', SongSchema);
