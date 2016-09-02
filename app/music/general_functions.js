var resultLists = [];
var finalResults = [];

var setup = function (songLists) {
	resultLists = songLists;
	finalResults = [];

	if (resultLists.length < 4) {
		console.log("Not enough service results lists!");
		return;
	}

	console.log("Created parser...");
}

var parseSongs = function () {
	/*var status = 1;
	while (status != 0) {
		console.log("Parsing...");
		processList();
		status = pickRoles();
	}*/

	for (i = 0; i < resultLists.length; i++) {
		for (j = 0; j < resultLists[i].length; j++) {
			finalResults.push(resultLists[i][j]);
		}
	}
	for (i = 0; i < finalResults.length; i++) {
		for (j = 0; j < finalResults.length; j++) {
			if (finalResults[i] === undefined || finalResults[j] === undefined) {

			} else {
				if (metadataCompare(finalResults[i],finalResults[j]) > 0.5 && i != j) {
					if (i < j) {
						finalResults[i].source = finalResults[i].source+"+"+finalResults[j].source;
						delete finalResults[j];
					} else {
						finalResults[j].source = finalResults[j].source+"+"+finalResults[i].source;
						delete finalResults[i];
					}
				}
			}
		}
	}
	finalResults = cleanList(finalResults);
}

var parseYoutubeTitleByTokenizing = function (songObject) {
	console.log(songObject.metadata.title);
	var dashIndex = songObject.metadata.title.indexOf("-");
	if (dashIndex == -1) {
		return null;
	}
	titleString = songObject.metadata.title
	songObject.metadata.title = titleString.substring(dashIndex+2);
	songObject.metadata.artist = titleString.substring(0,dashIndex-1);
	return songObject;
}

/*var pickRoles = function () {
	console.log("Picking roles...");
	roles.master = -1;
	roles.slaves = [];
	for (i = 0; i < resultLists.length; i++) {
		if (i == ytIndex) {
			continue;
		} else {
			if (resultLists[i].length > 0) {
				roles.master = i;
			}
		}
	}
	if (roles.master == -1) {
		if (resultLists[ytIndex].length > 0) {
			roles.master = ytIndex;
		} else {
			roles.master = -1;
			console.log("Finished parsing...");
			return 0;
		}
	}
	for (i = 0; i < resultLists.length; i++) {
		if (roles.master == i) {
			continue;
		} else {
			if (resultLists[i].length > 0) {
				roles.slaves.push(i);
			}
		}
	}
	console.log(roles);
	return 1;
}*/

/*var processList = function () {
	console.log("Processing list...");
	for (i = 0; i < resultLists[roles.master].length; i++) {
		if (compareSong(resultLists[roles.master][i])) {
			finalResults.push(resultLists[roles.master][i]);
			delete resultLists[roles.master][i];
		}
		resultLists[roles.master] = cleanList(resultLists[roles.master]);
	}
	for (i = 0; i < resultLists[roles.master].length; i++) {
		finalResults.push(resultLists[roles.master][i]);
	}
	resultLists[roles.master] = [];
}

var compareSong = function (song) {
	console.log("Comparing a song...");
	var foundMatch = false;
	for (i = 0; i < roles.slaves.length; i++) {
		for (j = 0; j < resultLists[roles.slaves[i]].length; j++) {
			if (metadataCompare(song,resultLists[roles.slaves[i]][j]) > 0.9) {
				console.log("MATCHED MATCHED MATCHED");
				foundMatch = true;
				delete resultLists[roles.slaves[i]][j];
			}
		}
		resultLists[roles.slaves[i]] = cleanList(resultLists[roles.slaves[i]]);
	}
	return foundMatch;
}*/

var cleanList = function (list) {
	console.log("Cleaning a list...");
	cleaned = [];
	for (i = 0; i < list.length; i++) {
		if (list[i] !== undefined) {
			cleaned.push(list[i]);
		}
	}
	return cleaned;
}

var metadataCompare = function (a,b) {
	return a.metadata.title == b.metadata.title ? 1 : 0;
}

var fetchResults = function () {
	return finalResults.sort(function (a,b) {return a - b;});
}

module.exports = {
	setup: setup,
	parseSongs: parseSongs,
	parseYoutubeTitleByTokenizing: parseYoutubeTitleByTokenizing,
	//pickRoles: pickRoles,
	//processList: processList,
	//compareSong: compareSong,
	cleanList: cleanList,
	metadataCompare: metadataCompare,
	fetchResults: fetchResults
}