angular.module('diveApp.project').controller('ProjectTopBarCtrl', function($scope) {
  $scope.rightPaneOpen = false;
  $scope.toggleRightPane = function() {
    $scope.rightPaneOpen = !$scope.rightPaneOpen;
  };
});