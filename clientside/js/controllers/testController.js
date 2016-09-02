app.controller('testController', ['$scope','$location','$http', function ($scope, $location, $http) {
    /*$(document).ready(function () {
        $('#search').keyup(function (event) {
            if (event.keyCode == 13) {
                if ($('#search').val() == "") {
                    alert("Please enter a search query.");
                    return;
                }
                searchSongs($('#search').val(),$('#typelist').val());
            }
        });
    });

    function login (username,password){
        $.get("/login/googlemusic?u="+username+"&p="+password, function(data){

        });
    }
    function refresh(){
        $.get("/refreshgooglemusic", function(data){

        });
    }

    function searchSongs (query,type) {
        $.get("/search?q="+query+"&s=googlemusic&t="+type+"&c=false", function (data) {
            $('#songs').empty();
            insertResults(data[0],type);
        });
    }

    function insertResults(data,type) {
                switch(type){
            case 'track':
                for (i=0;i<data.length;i++) {
                    $('#songs').append(
                        $('<li>', {
                            id: 'song'+i,
                            class: 'song',
                            text: data[i].metadata.title+" | "+data[i].metadata.artist+" | "+data[i].metadata.album+" | "+data[i].uri
                            }).data(data[i])
                        );
                    }
                break;
            case 'album':
                for (i=0;i<data.length;i++) {
                    $('#songs').append(
                        $('<li>', {
                            id: 'album'+i,
                            class: 'album',
                            text: data[i].name+" | "+data[i].albumartist+" | "+data[i].uri
                            }).data(data[i])
                        );
                    }
                break;
            case 'artist':
                for (i=0;i<data.length;i++) {
                    $('#songs').append(
                        $('<li>', {
                            id: 'artist'+i,
                            class: 'artist',
                            text: data[i].name+" | "+data[i].uri
                            }).data(data[i])
                        );
                    }
                break
            default: console.log('no type sent');
        }
    }*/
    
    $scope.testit = function () {
        $http.get('https://wlunlyjfwn.spotilocal.com:4371/remote/pause.json').success(function (data) {
            console.log(data);
        });
    }
}]);
