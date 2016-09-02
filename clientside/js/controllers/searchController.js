app.controller('searchController', ['$scope','$http', '$cookies', 'musicService', function ($scope, $http, $cookies, musicService) {
	$scope.musicService = musicService;
	$scope.searchModel = {'newPlaylistName': '','loadPlaylist': ''}

    $scope.searchResults = [];
	$scope.search = function () {
		if (!$scope.query) {
			alert("Please enter a search term!");
			return
		}
		$http.get('/search?q='+$scope.query+'&s='+$scope.service+'&combine=yes').then(function (response) {
			//$scope.clear();
			done = true;
			console.log(response.data);
			$scope.searchResults = response.data;
		});
	}
	$scope.saveCurrentQueue = function(){
		if($scope.isLoggedIn){
			$http.post('/playlist/new', {tracks: musicService.playlist, name:$scope.searchModel.newPlaylistName}).
	        success(function(data) {
	            alert(data);
	        }).
	        error(function(data) {
	            alert(data);
	        });
	    }
	    else{
	    	alert('You must be logged in');
	    }
	}

	$scope.loadPlaylist = function(){
		musicService.playlist = $scope.searchModel.loadPlaylist.tracks;
		$scope.searchModel.newPlaylistName = $scope.searchModel.loadPlaylist._id;
	}
    $scope.addSong = function(song){
        musicService.playlist.push(song);
    }
    $scope.clear = function(){
        musicService.playlist = [];   
    }

    var Init = function(){
    	if($cookies.loginToken != null){
    		$scope.isLoggedIn = true;
    	}
    	if($scope.isLoggedIn){
    		$http.get('/me/playlists').
    		success(function (data){
    			$scope.playlistArray = data;
    		}).
    		error(function (data){
    			alert('oops');
    		});
    	}
    }
    Init();
}]);
