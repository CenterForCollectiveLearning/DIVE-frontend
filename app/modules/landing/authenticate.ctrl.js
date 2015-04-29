var CryptoJS = require('crypto-js');

angular.module('diveApp.landing').controller("AuthenticateCtrl", function($scope, $http, $state, AuthService, API_URL) {
  $scope.loginUser = function(userName, password) {
    var password = CryptoJS.SHA3(password).toString(CryptoJS.enc.Hex)
    if (userName && password) {
      AuthService.loginUser(userName, password, function(data) {
        if (data['success'] === 1) {
          $scope.loggedIn = true;
          $scope.user = AuthService.getCurrentUser();
          $state.go('landing.create');
        } else {
          $scope.loginErr = true;
        }
      });
    } else {
      $scope.loginErr = true;
    }
  };

  // TODO Handle logins correctly
  $scope.registerUser = function(userName, displayName, password) {
    var password = CryptoJS.SHA3(password).toString(CryptoJS.enc.Hex)
    if (userName && displayName && password) {
      AuthService.registerUser(userName, displayName, password, function(data) {
        if (data['success'] === 1) {
          $scope.loginUser(userName, password);
          $state.go('landing.create');
        } else {
          $scope.regErr = true;
        }
      });
    } else {
      $scope.regErr = true;
    }
  };
});