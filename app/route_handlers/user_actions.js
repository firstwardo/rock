var Util = require('../utilities/misc_functions');
var db = require('../db/database_variables');

exports.checkIfAuthenticated = function (cookie, callback) {
	if(cookie != undefined){
		var cookie = JSON.parse(new Buffer(cookie,'hex').toString());
		db.onlineUsers.findOne({$and: [{token: cookie.token},{_id:cookie.user}]}, function (err,doc){
			if(doc == null){
				callback(false);
			}
			else{
				callback(true);
			}
		});
	} else {
		callback(false);
	}
}

exports.login = function (username, password, req, res) {
	if (req.session.activeUser != undefined) {
		res.send(ROCK_STATUS(200), {"data": "Already logged in."});
		return;
	}
	db.User.find({ username: username }, function (err, users) {
		if (users.length == 0) {
			console.log("bad username");
			console.log(username, password);
			res.send(ROCK_STATUS(403), {"error": "User/pass combo not found."});
			return;
		} else if (users.length != 1) {
			res.send(ROCK_STATUS(500), {"error": "Database indeterminate; multiple users found for that username."});
			return;
		} else {
			if (Util.checkCryptoPassword(password, users[0].salt, users[0].hash)) {
				req.session.activeUser = users[0];
				res.send(ROCK_STATUS(200), {"data": "Logged in."});
			} else {
				console.log("bad pass");
				console.log(username, password);
				res.send(ROCK_STATUS(403), {"error": "User/pass combo not found."});
			}
		}
	});
};

exports.logout = function (req, res) {
	if (!this.loggedIn(req)) {
		res.send(ROCK_STATUS(200), {"data": "Already logged out."});
	}
	req.session.activeUser = null;
	res.send(ROCK_STATUS(200), {"data": "You are logged off."});
}

// exports.register = function (username, password, res) {
// 	db.User.find({ username: username }, function (err, usersMatchingDesiredName) {
// 		if (usersMatchingDesiredName.length > 0) {
// 			res.send(409, {"data": "User already exists."});
// 		} else {
// 			callback = function(hash, salt) {
// 				var newUser = new db.User({ username: username, hash: hash, salt: salt });
// 				db.User.save(newUser, function (res, err) {
// 					if (err) {
// 						res.send(500, {"error": "Database error; user could not be saved."});
// 					}
// 				});
// 			}
// 			Util.newCryptoPassword(password, callback);
// 		}
// 	});
// }

exports.getInfo = function (req, res) {
	db.User.find({ username: req.session.activeUser.username }, function (err, usersMatchingDesiredName) {
		if (usersMatchingDesiredName.length > 1) {
			res.send(ROCK_STATUS(500), {"error": "Database indeterminate; multiple users found for that username."});
		} else {
			res.send(ROCK_STATUS(200), {"data": usersMatchingDesiredName[0]});
		}
	});
}

exports.loggedIn = function (request) {
	return request.session.activeUser !== undefined;
}
