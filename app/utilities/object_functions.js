exports.songObject = function (src,title,artist,album,genre,artwork,score,age,uri,url,duration) { //TODO: Decide on universal song specification
	return { // This method simply provides an easy way to make a song object in one line
		'source': src,
		'metadata': {
			'title': title,
			'artist': artist,
			'album': album,
			'genre': genre,
			'artwork': artwork,
			'duration': duration,
		},
		'score': score,
		'age': age,
		'uri': uri,
		'url' : url
	}
}

exports.artistObject = function (src,name,artwork,score,uri,url){
	return {
		'source': src,
		'name': name,
		'score': score,
		'artwork': artwork,
		'url': url,
		'uri': uri
	}
}

exports.albumObject = function(src,name,artwork,albumartist,score,uri,url){
	return {
			'source': src,
			'name': name,
			'albumartist': albumartist,
			'score': score,
			'url': url,
			'uri': uri,
			'artwork': artwork
		}
}
exports.combinedSongObject = function(src,title,artist,album,genre,artwork,score) { //TODO: Decide on universal song specification
	return { // This method simply provides an easy way to make a song object in one line
		'source': src,
		'metadata': {
			'title': title,
			'artist': artist,
			'album': album,
			'genre': genre,
			'artwork': artwork,
		},
		'score': score,
		'age': age,
	'googlemusic':{
		'uri': null,
		'url' : null,
		},
	'rdio':{
		'uri': null,
		'url' : null,
		},
	'spotify':{
		'uri': null,
		'url' : null,
		},
	'beatsmusic':{
		'uri': null,
		'url' : null,
		},
	'grooveshark':{
		'uri': null,
		'url' : null,
		},	
	'soundcloud':{
		'uri': null,
		'url' : null,
		},
	'xboxmusic':{
		'uri': null,
		'url': null,
		},
	'rhapsody':{
		'uri': null,
		'url': null,
		},
	'youtube':{
		'uri': null,
		'url': null,
		}
	}
}
exports.playlistObject = function(name, id, tracks, source){
	return{
		'name': name,
		'id': id,
		'tracks': tracks,
		'source': source,
	}
}
exports.userObject = function(email, username, hash, salt){
	return{
		'email': email,
		'username': username,
		'password': {
			'hash': hash,
			'salt': salt,
		},
		'soundcloud': {
			'accesstoken': null,
			'id': null,
		},
		'googlemusic': {
			'username': null,
			'password': null,
		},
		'beatsmusic': {
			'accesstoken': null,
			'refreshtoken': null,
			'expiresin': null,
			'id': null,
		},
		'grooveshark': {
			'sessionid': null,
		},
		'youtube': {
			'accesstoken': null,
			'refreshtoken': null,
			'expiresin': null,
		},
		'rdio': {
			'accesstoken': null,
		},
		'rhapsody':{
			'accesstoken': null,
			'refreshtoken': null,
			'expiresin': null,
		},
		'spotify':{
			'username': null,
			'password': null,
		}
	}
}