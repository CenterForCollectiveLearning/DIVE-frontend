angular.module('diveApp.project').controller 'ProjectTopBarCtrl', ($scope) ->
	$scope.rightPaneOpen = false
	$scope.toggleRightPane = ->
		$scope.rightPaneOpen = !$scope.rightPaneOpen
