angular.module('diveApp.project').controller "OverviewCtrl", ($scope, $http, $state) ->
  console.log("[CONTROLLER] Overview")
  # TODO: How to deal with same method?
  $scope.removeProject = (pID) ->
    console.log('Removing project, pID:', pID)
    $http.delete('http://localhost:8888/api/project',
      params:
        pID: pID
    ).success((result) ->
      $state.go('landing')
    )