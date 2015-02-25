angular.module('diveApp.project').controller 'EngineTopBarCtrl', ($scope) ->
	$scope.rightPaneOpen = false
	$scope.toggleRightPane = ->
		$scope.rightPaneOpen = !$scope.rightPaneOpen
