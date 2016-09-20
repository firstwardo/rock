app.controller('loginController', ['$scope','$http', function ($scope, $http) {
	$scope.loginModel = {'username': '', 'password': '', 'rememberme': false};
	$scope.pootis = 'here';
	$scope.logout = function(){
		$http.get('/api/logout').
		success(function (data) {
			alert(data);
		}).
		error(function (data) {
			alert(data);
		});
	}
	 $scope.login = function(){
		var user = $scope.loginModel.username;
		var password = $scope.loginModel.password;
		var remember = $scope.loginModel.rememberme;
		$http.post('/api/login',{
			'user': user,
			'password': password,
			'remember': remember,
		}).
		success(function (data) {
			if(data != "Incorrect Password" && data != "User does not exist!"){
				console.log(data);
				window.open(data,'_self');
			}
			else{
				alert(data);
			}
		}).
		error(function (data){
			alert('something went wrong');
		});
	}
}]);
