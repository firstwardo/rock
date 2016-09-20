app.controller('newController', ['$scope','$location', function ($scope,$location) {
    $(document).ready(function () {
        $('#search').keyup(function (event) {
            if (event.keyCode == 13) {
                if ($('#search').val() == "") {
                    alert("Please enter a search query.");
                    return;
                }
                searchSongs($('#search').val(),"all",$('#typelist').val(),'false');
            }
        });
    });

    function searchSongs (query,service,type,combine) {
        $.get("/api/search?q="+query+"&s="+service+"&t="+type+"&c="+combine, function (data) {
            $('#songs').empty();
            if(combine=='true'){
                insertCombinedResults(data,type);
            }
            else{
                    for(x=0;x<data.length;x++){
                        insertResults(data[x],type);
                    }
                }
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
                            text: data[i].metadata.title+" | "+data[i].metadata.artist+" | "+data[i].metadata.album+" | "+data[i].source
                            }).data(data[i])
                        );
                        $('#songs').append(
                                $('<button>', {
                                id: 'playlist'+i,
                                class: 'song',
                                text: 'Add to Playlist',
                                onClick: 'addPlaylist("'+i+'")'
                                })
                            );
                    }
                break;
            case 'album':
                for (i=0;i<data.length;i++) {
                    $('#songs').append(
                        $('<li>', {
                            id: 'album'+i,
                            class: 'album',
                            text: data[i].name+" | "+data[i].albumartist+" | "+data[i].source
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
                            text: data[i].name+" | "+data[i].source
                            }).data(data[i])
                        );
                    }
                break
            default: console.log('no type sent');
        }
        addPlaylist = function addToPlaylist(index){
        console.log(index);
        playlist = window.prompt("Enter exisiting playlist","SexyGriz");
        $.post("/api/playlist",{p: playlist, s: data[index]}, function (data) {

        });

    }
    }



    function insertCombinedResults(data) {
        urlArray = []
                for(i=0;i<data.length;i++){
                    $('#songs').append(
                        $('<li>', {
                            id: 'song'+i,
                            class: 'song',
                            text: data[i].metadata.title+" | "+data[i].metadata.artist+" | "+data[i].metadata.album+" | "+data[i].source
                            }).data(data[i])
                        );
                        $('#songs').append(
                            $('<button>', {
                            id: 'song'+i,
                            class: 'song',
                            text: 'Play on Grooveshark',
                            onClick: 'getGSUrl('+data[i].grooveshark.uri+');'
                            })
                        );
                        $('#songs').append(
                            $('<button>', {
                            id: 'song'+i,
                            class: 'song',
                            text: 'Play on Soundcloud',
                            onClick: 'window.open("'+data[i].soundcloud.url+'")'
                            })
                        );
                    }
    }
    function getGSUrl (query){
            $.get("/api/search/gssongurl?q="+query, function (result) {
                window.open(""+result+"");
            });
        }
}]);
