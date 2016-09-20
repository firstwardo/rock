app.controller('registerController', ['$scope','$http', function ($scope, $http) {
	$scope.registerModel = {'email': '', 'username': '', 'password': '', 'passwordRetype': ''};

	$scope.register = function() {
		var email = $scope.registerModel.email;
		var username = $scope.registerModel.username;
		var password = $scope.registerModel.password;
		var password2 = $scope.registerModel.passwordRetype;
		if (password != password2) {
			alert("Please double check that you typed your password correctly.");
			return;
		}
		$http.post('/api/register',{
			'email': email,
			'username': username,
			'password': password,}).
		success(function(data){
			if(data != "User already exists."){
				window.open(data,'_self');
			}
			else{
				alert(data);
			}
		}).
		error(function(data){
			alert('oops');
		});
	}
}]);
