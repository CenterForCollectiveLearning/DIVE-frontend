angular.module('diveApp.project').controller "OverviewCtrl", ($scope, $http, $state, $stateParams, API_URL) ->
  console.log("[CONTROLLER] Overview")
  # TODO: How to deal with same method?
  console.log "LALALLA", $stateParams
  $scope.removeProject = (pID) ->
    console.log('Removing project, pID:', pID)
    $http.delete(API_URL + '/api/project',
      params:
        pID: pID
    ).success((result) ->
      $state.go('landing')
    )