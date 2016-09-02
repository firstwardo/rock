exports.checkConnectivity = function () {
	request.get("http://thin.npr.org", function (err, response, body) {
		if (body != undefined && body.indexOf("<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">") != -1) {
			console.log("Connected to the internet.");
			app.locals.internetAccess = true;
		} else {
			console.log("Not connected to the internet.".red);
			app.locals.internetAccess = false;
		}
	});
};

exports.connected = function () {
	var connected = app.locals.internetAccess;
	if (!connected) {
		console.log("Not connected to the internet.".red);
	}
	return connected;
};