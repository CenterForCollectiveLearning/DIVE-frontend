var CryptoJS = require('crypto-js');

angular.module('diveApp.landing').controller("AuthenticateCtrl", function($scope, $http, $state, AuthService, API_URL) {
  $scope.loginUser = function(userName, password) {
    if (userName && password) {
      var encPassword = CryptoJS.SHA3(password).toString(CryptoJS.enc.Hex)
      AuthService.loginUser(userName, encPassword, function(data) {
        console.log("Login data", data);
        if (data['success']) {
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
    if (userName && displayName && password) {
      var encPassword = CryptoJS.SHA3(password).toString(CryptoJS.enc.Hex)
      AuthService.registerUser(userName, displayName, encPassword, function(data) {
        console.log("register data", data)
        if (data['success']) {
          AuthService.loginUser(userName, encPassword, function(data) {
            $state.go('landing.create');
          })
        } else {
          $scope.regErr = true;
        }
      });
    } else {
      $scope.regErr = true;
    }
  };
});