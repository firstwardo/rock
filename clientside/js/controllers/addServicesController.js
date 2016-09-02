app.controller('addServicesController', ['$scope','$http', function ($scope, $http) {

    $http.get('/authedApps').
    success(function (data){
        $scope.authedApps = data;
        console.log(data);
    }).
    error(function (data){

    });

    $http.get('/save-data').
    success(function (data){
        alert("loaded");
        $scope.sessionTest = data;
        console.log(data);
    }).
    error(function (data){

    });


    $scope.loginToBeatsMusic = function() {
            window.open('/login/beatsmusic');
    }
    $scope.loginToSoundcloud = function () {
            window.open('/login/soundcloud');

    }
    $scope.loginToGrooveshark = function (username, password) {
            $.post('/login/grooveshark',{username: username, password: password}, function(data){
                alert(data);
            });
    }
    $scope.loginToGooglemusic = function (username,password){
            $.post("/login/googlemusic",{username: username, password: password}, function(data){
                alert(data);
            });
    }
    $scope.loginToRhapsody = function () {
            window.open('/login/rhapsody');

    }
    $scope.loginToYoutube = function (){
            window.open('/login/youtube');

    }
    $scope.loginToRdio = function (){
            window.open('/login/rdio');

    }
    $scope.loginToSpotify = function (username,password){
        $http.post('/login/spotify', {username:username,password:password}).
        success(function (data){
            alert(data);
        }).
        error(function (data){
            alert('oops');
        });
    }
    $scope.refresh = function (){
        $http.get('/refreshgooglemusic').
        success(function (data){
            alert(data);
        }).
        error(function (data){
            alert('oops');
        });
    }

    $scope.sessionTest = "Green";
    $scope.saveData = function () {
        $http.post('/save-data', {data: $scope.sessionTest})
        .success(function () {
            alert("saved");
        });
    }
}]);
