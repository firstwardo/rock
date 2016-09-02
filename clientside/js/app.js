app = angular.module('app', ['ngRoute','angular-loading-bar','ngCookies','ui.sortable'])

.config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.latencyThreshold = 0; //loading bars all the time!
  }]);
