var crypto = require('crypto');

exports.newCryptoPassword = function (password, callback) {
	var salt = crypto.randomBytes(128).toString('base64');
	crypto.pbkdf2(password, salt, 10000, 512, 'sha256', function(err, derivedKey) {
		callback(derivedKey, salt);
	});
}

exports.checkCryptoPassword = function (password, salt, userHash) {
	console.log("Checking password...");
	console.log(password);
	console.log(salt);
	console.log(userHash);
	var derivedKey = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha256');
	console.log(derivedKey == userHash);
	return derivedKey == userHash;
};

exports.newCookie = function (data) {
	data = JSON.stringify(data);
	var hex = '';
	for(var i=0;i<data.length;i++) {
		hex += ''+data.charCodeAt(i).toString(16);
	}
	return hex;
};

if (!Array.prototype.includes) {
	Array.prototype.includes = function(searchElement /*, fromIndex*/ ) {
		'use strict';
		var O = Object(this);
		var len = parseInt(O.length) || 0;
		if (len === 0) {
			return false;
		}
		var n = parseInt(arguments[1]) || 0;
		var k;
		if (n >= 0) {
			k = n;
		} else {
			k = len + n;
			if (k < 0) {k = 0;}
		}
		var currentElement;
		while (k < len) {
			currentElement = O[k];
			if (searchElement === currentElement || (searchElement !== searchElement && currentElement !== currentElement)) {
				return true;
			}
		}
		k++;
	}
	return false;
};
