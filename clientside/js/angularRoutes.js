app.config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/addServices', {
        templateUrl: '/views/addServices.html',
        controller: 'addServicesController'
      })
      .when('/new', {
        templateUrl: '/views/new.html',
        controller: 'newController'
      })
      .when('/importPlaylist', {
        templateUrl: '/views/importPlaylist.html',
        controller: 'importPlaylistController'
      })
      .when('/test', {
        templateUrl: '/views/test.html',
        controller: 'testController'
      })
      .when('/searchMusic', {
        templateUrl: '/views/search.html',
        controller: 'searchController'
      })
      .when('/login', {
        templateUrl: '/views/login.html',
        controller: 'loginController'
      })
      .when('/register', {
        templateUrl: '/views/register.html',
        controller: 'registerController'
      })
      .when('/addServices', {
        templateUrl: '/views/addServices.html',
        controller: 'addServicesController'
      })
      .otherwise({
        redirectTo: '/'
      });

    $locationProvider.html5Mode(false);
  });