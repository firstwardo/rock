app.controller('musicController', function ($scope,$sce) {
	$scope.playlist = [];
	$scope.addSong = function (song) {
		$scope.playlist.push(song);
	};
	$scope.clear = function () {
		//$scope.playlist = [];
	};
	$scope.getTopSong = function () {
		if ($scope.playlist.length > 0) {
			return $scope.playlist[0];
		} else {
			return null;
		}
	}
	$scope.skipSong = function () {
		$scope.playlist.shift();
	}
	$scope.trustSrc = function(src) {
    return $sce.trustAsResourceUrl(src);
  }
});
