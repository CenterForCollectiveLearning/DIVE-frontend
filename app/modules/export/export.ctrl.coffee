angular.module('diveApp.export').controller "AssembleCtrl", ($scope, $http, ExportedVizSpecService) ->
	$scope.specs = ['a', 'b', 'c']
	ExportedVizSpecService.promise((specs) ->
		console.log(specs)
		$scope.specs = specs.result
  )