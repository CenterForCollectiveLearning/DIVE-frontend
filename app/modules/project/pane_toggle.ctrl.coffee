angular.module('diveApp.project').controller 'PaneToggleCtrl', ($scope) ->
  $scope.leftClosed = false
  $scope.rightClosed = false
  $scope.toggleLeft = -> $scope.leftClosed = !$scope.leftClosed
  $scope.toggleRight = -> $scope.rightClosed = !$scope.rightClosed
