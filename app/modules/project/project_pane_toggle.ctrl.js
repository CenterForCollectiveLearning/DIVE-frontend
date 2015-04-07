angular.module('diveApp.project').controller('PaneToggleCtrl', function($scope) {
  $scope.leftClosed = false;
  $scope.rightClosed = false;
  $scope.toggleLeft = function() {
    return $scope.leftClosed = !$scope.leftClosed;
  };
  $scope.toggleRight = function() {
    return $scope.rightClosed = !$scope.rightClosed;
  };
});