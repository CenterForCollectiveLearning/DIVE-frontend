angular.module('diveApp.landing').controller "CreateProjectFormCtrl", ($scope, $http, $location, API_URL) ->
  $scope.create_project = ->
    params = {
      title: $scope.newProjectData.title
      description: $scope.newProjectData.description
      user_name: $scope.user.userName
    }
    $http(
      method: 'POST'
      url: API_URL + '/api/project'
      data: params
      transformRequest: objectToQueryString
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    ).success((data, status) ->
      $location.path($scope.user.userName + '/' + data.formatted_title)
    ).error((data, status) ->
      # TODO Catch other types of errors
      $scope.titleTaken = true
      )