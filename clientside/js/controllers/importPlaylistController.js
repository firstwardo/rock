app.controller('importPlaylistController', ['$scope','$location','$http', function ($scope, $location, $http) {
    $scope.importPlaylistModel = {'searchBox': '', 'spotifyURI': ''};
    $scope.playlistItems = [];
    $scope.playlistArray = [];
    
    $scope.getPlaylist = function() {
        $http.get("/api/playlist?p="+$scope.importPlaylistModel.searchBox).
        success(function(data) {
            insertResults(data);
        }).
        error(function(data) {
            alert('Something went wrong');
        });
    }
    $scope.getSCPlaylistList = function(){
        $http.get('/api/soundcloud/playlist').
        success(function(data) {
            console.log(data)
            insertList(data);
        }).
        error(function(data) {
            alert('Something went wrong');
        });
    }
    function insertResults(data) {
            $scope.playlistItems = [];
                for (i=0;i<data.length;i++) {
                    $scope.playlistItems.push(data[i]);
                    /*$('#songs').append(
                        $('<li>', {
                            id: 'song'+i,
                            class: 'song',
                            text: data[i].metadata.title+" | "+data[i].metadata.artist+" | "+data[i].metadata.album+" | "+data[i].source
                            }).data(data[i])
                        );*/
                }
    }
    function insertList(data){
        $scope.playlistArray = [];
        for (i=0;i<data.length;i++) {
            console.log(data[i])
            $scope.playlistArray.push(data[i]);
                    /*$('#songs').append(
                        $('<li>', {
                            id: 'song'+i,
                            class: 'playlist',
                            text: data[i].name
                            })
                        );
                        $('#songs').append(
                                $('<button>', {
                                id: 'openButton'+i,
                                class: 'song',
                                text: 'Open Playlist',
                                onClick: 'insertPlaylistResults("'+i+'")'
                                })
                            );
                    $('#songs').append(
                        $('<li>', {
                            id: 'playlist'+i,
                            class: 'song',
                            })
                        );*/
                }
    }
    $scope.insertPlaylistResults=function(playlistObj){
            /*
            $('#song'+i).append(
                        $('<button>', {
                        id: 'saveButton'+i,
                        class: 'song',
                        text: 'Save Playlist To Songbox',
                        onClick: 'savePlaylistToSongbox("'+i+'")'
                        })
                    );*/
            
            if(playlistObj.source == 'spotify' || playlistObj.source == 'beatsmusic' || playlistObj.source == 'rhapsody'){
                $http.post('/api/'+data[i].source+'/lookupTracks', {'playlist': playlistObj}).
                success(function(data) {
                    insertResults(data);
                }).
                error(function(data) {
                    alert('something went wrong');   
                });
            }
            else{
                insertResults(playlistObj.tracks);
            }
        }
    
    
    $scope.savePlaylistToSongbox = function(playlistObj){
        $http.post('/api/playlist/new', {tracks: playlistObj.tracks,name:playlistObj.name}).
        success(function(data) {
            alert(data);
        }).
        error(function(data) {
            alert(data);
        });
    }

    $scope.getSpotifyPlaylist = function(){
        $http.post('/api/spotify/getPlaylist', {'url':importPlaylistModel.spotifyURI}).
        success(function(data) {
            insertPlaylistResults(data.tracks);
        }).
        error(function(data) {
           alert('something went wrong'); 
        });
        /*$.post('/api/spotify/getPlaylist',{url:url}, function(data){
            playlistsOnPage = [];
            playlistsOnPage.push(data);
            $('#songs').empty();
            $('#songs').append(
                        $('<li>', {
                            id: 'song'+0,
                            class: 'playlist',
                            text: data.name
                            }),
                            $('<button>', {
                            id: 'saveButton'+0,
                            class: 'song',
                            text: 'Save Playlist To Songbox',
                            onClick: 'savePlaylistToSongbox("'+0+'")'
                            })

                        );
                    $('#songs').append(
                        $('<li>', {
                            id: 'playlist'+0,
                            class: 'song',
                            })
                        );
                    console.log(data.tracks.length)
            for(x=0;x<data.tracks.length;x++){
                song = data.tracks[x];
                                $('#playlist'+0).append(
                                    $('<li>', {
                                        id: 'song'+x,
                                        class: 'song',
                                        text: song.metadata.title+" | "+song.metadata.artist+" | "+song.metadata.album+" | "+song.source
                                        }).data(song)
                                    );
                            }
        });*/
    }

    $scope.getMySpotifyPlaylists = function(){
        $http.get('/api/spotify/getMyPlaylists').   
        success(function(data) {
            insertList(data);
        }).
        error(function(data){ 
        
        });
    }

    $scope.getGoogleMusicPlaylists = function(){
        $http.get('/api/googlemusic/getMyPlaylists').   
        success(function(data) {
            insertList(data);
        }).
        error(function(data){ 
        
        });
    }

    $scope.getBeatsMusicPlaylists = function(){
        $http.get('/api/beatsmusic/getMyPlaylists').   
        success(function(data) {
            insertList(data);
        }).
        error(function(data){ 
        
        });
    }
    $scope.getRhapsodyPlaylists = function(){
        $http.get('/api/rhapsody/getMyPlaylists').   
        success(function(data) {
            insertList(data);
        }).
        error(function(data){ 
        
        });
    }
}]);
