console.log("LOADING...");
//using node.js 0.10.26 and mongodb 2.6.0
//halo 6

// Define some constants

// Why is this here, you may ask? Let me tell you a story.
// AFNetworking, wonderful thing though it is, stupidly seems to
// not let you parse the response HTTP body for a 403 or 401, etc.
// status code. So the workaround is to preserve the data in rock
// source files about what the correct error code is and use
// the following constant and macro to define whether or not
// we allow AFNetorking to override our own error messages
// (dispalyed when all status codes are legit) or force our own
// error messages (displayed when all status codes are 200).
var ALL_STATUS_CODES_200 = false;

// Define functions that bind constants to the app
global.ROCK_STATUS = function (statusCode) {
	return ALL_STATUS_CODES_200 ? 200 : statusCode;
}

// Import main libraries
var express = require('express');
var colors = require('colors');
var request = require('request');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('static-favicon');
var fs = require('fs');
var https = require('https');
var http = require('http');

var sslkey = fs.readFileSync('./chillssl.key');
var sslcert = fs.readFileSync('./ssl.crt')

var options = {
//     key: sslkey,
//     cert: sslcert
};

// Set up the object for our app
app = express();

// Import private server files
obj = require('./app/utilities/object_functions');
db = require('./app/db/database_variables');
seed = require('./app/db/db_seed');
routes = require('./app/routes/index');
require('./app/utilities/console');
var internetAccess = require('./app/utilities/internet_access');

// Test comment for sigsoft
// Get an object in ther server's memory to hold access tokens, other data we will get through authentication
app.prototype.data = null;
app.data = {
	authRedir: "/",
	soundcloud: {
		clientId: '09b2e1e58b17e2b6e33e9b6dafb574d3',
		clientSecret: '3338c6fc993412001bed03ed96cca141',
		redirectUri: 'http://localhost:5000/callback/sc'
	},
	youtube: {
		serverId: 'AIzaSyA0fHiJCKt3eNGXNH19H2GY8wLYjGOlEM0',
		clientId: '552128561580-1b2v2rberi3mndt3kmpo0ddrk1pu63nq.apps.googleusercontent.com',
		clientSecret: 'yafPwpN7etC6x7HQ-HekKnBZ',
		redirectUri: 'http://localhost:5000/callback/yt',
	},
};

// Express Configuration
var logger = function (req,res,next) {
	console.log("   info  (backend) - ".cyan+req.method+" "+req.url);
	next();
};

var error = function (req,res,next) {
	res.send('You requested '+req.url+', which we don\'t have');
	console.log('   error (backend) - '.red+'client tried to '+req.method+' '+req.url+' which is an undefined route :(');
	// No call to next().
};

var allStatusCodesBecome200 = function (req, res, next) {
	res.on('finish',function () {
		res.statusCode = 200;
	});
	next();
};

var render = function (res,htmlFileName) {
	fs.readFile(__dirname + '/clientside/views/'+htmlFileName, 'utf8', function (err, text) {
		res.send(text);
	});
};

var secureRedirect = function(req, res, next) {
  if(!req.secure) {
	return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  next();
};

app.use('/views', function (req,res) {
	render(res, req.url);
});
//app.set('views', __dirname + '/clientside/views');
//app.set('view engine', 'jade');
app.use(cookieParser());
// app.use(secureRedirect);
require('./app/utilities/smart_sessions')(app); // This specifically has to come after cookie parser

app.use(bodyParser());
app.use(favicon());
app.use(logger);
app.use(allStatusCodesBecome200);
app.use(express.static(__dirname + '/clientside'));
app.use('/api', routes);

//Playlist routes-------------------------------------------------------------------------------------------
// app.get('/playlist', function(req,res) {
// 	misc.getPlaylist(req,res);
// });
// app.post('/playlist', function(req,res) {
// 	misc.addToPlaylist(req,res);
// });
// app.post('/playlist/new', function(req,res){
// 	misc.newPlaylist(req,res);
// });


app.use(error);

console.log("STARTED...");
internetAccess.checkConnectivity();

// console.log("RUNNING INSECURE");
http.createServer(app).listen(80);
