app.controller('musicPlayerBarController', ['$scope','$http','$interval', '$window','musicService', function ($scope, $http, $interval, $window,musicService) {
    // Define init funcitons
    $scope.musicService = musicService;
    $scope.musicPlayerBarModel = {volume: 100};
    $scope.currentTrackProgress = 0;
    $scope.currentTrackDuration = 0;
    var stop = null;
    var startTimer = function(){
    	if(stop != null){
    		$interval.cancel(stop);
    	}
		stop = $interval($scope.providers[$scope.currentProvider].timer, 1000);
    }
    var stopTimer = function(){
    	$interval.cancel(stop);
    }

    $scope.$watch('musicPlayerBarModel.volume', function(obj){
    	if($scope.providers[$scope.currentProvider] != null){
    		$scope.providers[$scope.currentProvider].setVolume(obj);
    	}
    });
	$scope.seekTrack = function(e) {
	    if($scope.providers[$scope.currentProvider] != null){
	    	$scope.providers[$scope.currentProvider].seekTrack(e.offsetX/e.currentTarget.clientWidth);
		}
	};

    $scope.initSC = function () {
        SC.initialize({
    		client_id: "a7d86f4d142a16084e26cb98b74f76f3",
			redirect_uri: "http://localhost:5000/callback/sc",
		});
		$scope.providers['sc'] = {
			player: null
		};
		var scOptions = {
			onload: function(success){
				$scope.currentTrackDuration = $scope.providers.sc.player.duration;
				console.log('sc loaded');
			},
			onplay : function() {
				$scope.providers['sc'].status = 'playing';
				startTimer();
				console.log('sc playing');
			},
			onfinish : function(){
				$scope.providers['sc'].status = 'ended';
				stopTimer();
				$scope.skip();
			},
			onresume : function(){
				$scope.providers['sc'].status = 'playing';
				startTimer();
				console.log('sc resumed')
			},
			onpause : function() {
				$scope.providers['sc'].status = 'paused';
				stopTimer();
				console.log('sc paused')
			},
			volume: $scope.musicPlayerBarModel.volume
		}

		var load = function (songID) {
			SC.stream("/tracks/"+songID, scOptions, function (sound) {
				$scope.providers.sc.player = sound;
				$scope.providers.sc.player.play();
				$scope.currentTrackDuration = $scope.getTopSong().metadata.duration;
				$scope.providers['sc'].setVolume = function(vol){
					$scope.providers.sc.player.setVolume(vol);
				}
			});
		}
		var play = function (songID) {
			$scope.providers.sc.player.play();
		}
		var pause = function (songID) {
			$scope.providers.sc.player.pause();
		}
		var stop = function (songID) {
			$scope.providers.sc.player.stop();
		}
		$scope.providers['sc'].load = load;
		$scope.providers['sc'].play = play;
		$scope.providers['sc'].pause = pause;
		$scope.providers['sc'].stop = stop;
		$scope.providers['sc'].timer = function(){
			$scope.currentTrackProgress = $scope.providers.sc.player.position;
			//console.log($scope.currentTrackProgress)
			//console.log($scope.currentTrackDuration)
		}
		$scope.providers['sc'].seekTrack = function(newPercent){
			var loaded = $scope.providers.sc.player.bytesLoaded/$scope.providers.sc.player.bytesTotal;
			if(newPercent <= loaded){
				$scope.providers.sc.player.setPosition(newPercent * $scope.providers.sc.player.duration);
			}
		}

	}
	$scope.initYT = function () {
		$scope.providers['yt'] = {
			player: null
		};

		$scope.ytReady = function (event) {
			console.log("Youtube Player Ready");
		};
		$scope.ytStateChange = function (event) {
			console.log("Youtube Player Changed State");
			console.log(event.data);
			switch(event.data){
				case -1:
					$scope.providers['yt'].status = 'unstarted';
					break;
				case 0:
					$scope.providers['yt'].status = 'ended';
					stopTimer();
					$scope.skip();
					break;
				case 1:
					$scope.providers['yt'].status = 'playing';
					$scope.currentTrackDuration = $scope.providers.yt.player.getDuration()
					startTimer();
					break;
				case 2:
					$scope.providers['yt'].status = 'paused';
					stopTimer();
					break;
				case 3:
					$scope.providers['yt'].status = 'buffering';
					break;
				case 5:
					$scope.providers['yt'].status = 'video queued';
					break;
			}
		};

		var tag = document.createElement('script');

		tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName('script')[0];
		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		$window.onYouTubeIframeAPIReady = function () {
			console.log("doing shit");
			$scope.providers['yt'].player = new YT.Player('ytPlayer', {
				height: '135',
				width: '240',
				videoId: 'YxmlaUAtN_E',
				events: {
					'onReady': $scope.ytReady,
					'onStateChange': $scope.ytStateChange
				}
			});
		}
		var load = function (songID) {
			$scope.providers.yt.player.loadVideoById(songID,0,"large");
			$scope.providers['yt'].setVolume = function(vol){
				$scope.providers.yt.player.setVolume(vol);
			}
			$scope.providers.yt.player.setVolume($scope.musicPlayerBarModel.volume);
		}
		var play = function (songID) {
			$scope.providers.yt.player.playVideo();
		}
		var pause = function (songID) {
			$scope.providers.yt.player.pauseVideo();
		}
		var stop = function (songID) {
			$scope.providers.yt.player.stopVideo();
		}
		$scope.providers['yt'].load = load;
		$scope.providers['yt'].play = play;
		$scope.providers['yt'].pause = pause;
		$scope.providers['yt'].stop = stop;
		$scope.providers['yt'].timer = function() {
			$scope.currentTrackProgress = $scope.providers.yt.player.getCurrentTime();
			console.log($scope.currentTrackProgress)
			console.log($scope.currentTrackDuration)
		}
		$scope.providers['yt'].seekTrack = function(newPercent){
			$scope.providers.yt.player.seekTo(newPercent * $scope.providers.yt.player.getDuration(), true);
		}
	}

	$scope.initGS = function () {
		$scope.providers['gs'] = {
			callbacksSetUp: false,
			player: null
		};
		swfobject.embedSWF("http://grooveshark.com/APIPlayer.swf", "gsPlayer", "0", "0", "9.0.0", "", {}, {allowScriptAccess: "always"}, {id:"groovesharkPlayer", name:"groovesharkPlayer"}, function (e) {
			if (e.ref) {
				$scope.providers['gs'].player = e.ref;
			} else {
				console.log("NO GS PLAYER");
				alert("Grooveshark player failed to load! Try refreshing.");
			}
		});
    var gsLoadSong = function (songID) {
      $http.get("/api/load_gs_song", { params: { songID: songID } }).success(function (data) {
        console.log(data);
        $scope.providers['gs'].player.setVolume($scope.musicPlayerBarModel.volume);
        var urlTokens = data.url.split('/');
        console.log(data.StreamKey);
        console.log(urlTokens[2]);
        console.log(data.StreamServerID);
        $scope.providers['gs'].player.playStreamKey(data.StreamKey, urlTokens[2], data.StreamServerID);
      });
    };
    $scope.providers['gs'].gsLoadSong = gsLoadSong;
		var load = function (songID) {
			if (!$scope.providers['gs'].callbacksSetUp) {
				$window.gsSongEnded = function () {
					$scope.skip();
				};
				$window.gsStatus = function (status) {
					$scope.providers['gs'].status = status;
					console.log('gs ' +status);
					switch(status){
            case 'loading':
              setTimeout(function() {
                if ($scope.providers['gs'].status != 'playing') {
                  console.log("retrying gs load...");
                  $scope.providers['gs'].load(songID);
                } else {
                  console.log("Already playing!");
                }
              }, 5000);
						case 'playing':
							startTimer();
							break;
						case 'paused':
							stopTimer();
							break;
					}
				}
				$window.gsPosition = function(obj) {
					$scope.currentTrackDuration = obj.duration;
					$scope.currentTrackProgress = obj.position;
				}
				$scope.providers['gs'].player.setSongCompleteCallback('gsSongEnded');
				$scope.providers['gs'].player.setStatusCallback('gsStatus');
				$scope.providers['gs'].player.setPositionCallback('gsPosition');
				$scope.providers['gs'].callbacksSetUp = true;
			}
      $scope.providers['gs'].gsLoadSong(songID);
		};
		var play = function () {
			$scope.providers.gs.player.resumeStream();
		}
		var pause = function () {
			$scope.providers.gs.player.pauseStream();
		}
		var stop = function () {
			$scope.providers.gs.player.stopStream();
		}
		$scope.providers['gs'].load = load;
		$scope.providers['gs'].play = play;
		$scope.providers['gs'].pause = pause;
		$scope.providers['gs'].stop = stop;
		$scope.providers['gs'].seekTrack = function(newPercent){
			$scope.providers.gs.player.seekTo(newPercent * $scope.currentTrackDuration);
		}
		$scope.providers['gs'].timer = function(){
			//console.log($scope.currentTrackProgress)
			//console.log($scope.currentTrackDuration)
		}
    $scope.providers['gs'].setVolume = function(vol){
      $scope.providers.gs.player.setVolume(vol);
    }
	};

	$scope.init = function () {
		$scope.playing = false;
		$scope.songLoaded = false;
		$scope.currentProvider = null;

		$scope.providers = {};
		$scope.initSC();
		$scope.initYT();
		$scope.initGS();
	}

	// Define playback control functions

	$scope.pause = function () {
		$scope.providers[$scope.currentProvider].pause();
		$scope.playing = false;
		stopTimer();
	}

	$scope.play = function () {
		if (!$scope.songLoaded) {
			console.log("No song found, need to load...");
			$scope.currentTrackProgress = 0;
			$scope.loadSong();
			return;
		}
		if(!$scope.playing){
			$scope.providers[$scope.currentProvider].play();
			console.log("Playing...");
		}
		$scope.playing = true;
	}

	$scope.loadSong = function () {
		$scope.currentTrackProgress = 0;
		$scope.currentTrackDuration = 0;
		var song = $scope.getTopSong();
		if (song == null) {
			console.error("No more songs!");
			return;
		}
		console.log("Loading song...");
		console.log(song);
		if (song.source == 'soundcloud') {
			$scope.currentProvider = 'sc';
		} else if (song.source == 'youtube') {
			$scope.currentProvider = 'yt';
		} else if (song.source == 'grooveshark') {
			$scope.currentProvider = 'gs';
		} else {
			console.error("Song provider player unimplemented.");
		}
		$scope.providers[$scope.currentProvider].load(song.uri);
		$scope.songLoaded = true;
		$scope.playing = true;
	}

	$scope.skip = function () {
		console.log("Skipping...");
		$scope.stop();
		$scope.songLoaded = false;
		$scope.skipSong();
		$scope.play();

	}

	$scope.stop = function () {
		if ($scope.playing) {
			$scope.providers[$scope.currentProvider].stop();
			stopTimer();
			$scope.currentTrackProgress = 0;
		}
	}

    $scope.getTopSong = function () {
        if (musicService.playlist.length > 0) {
            return musicService.playlist[0];
        } else {
            return null;
        }
    };

    $scope.skipSong = function () {
        musicService.playlist.shift();
    };

    // Init and let's go!

	$scope.init();
}]);
