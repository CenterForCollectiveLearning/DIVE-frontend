# Landing page project list / navigation
angular.module('diveApp.landing').controller("ProjectListCtrl", ($scope, $http, $location, $rootScope, AllProjectsService) ->
  console.log("[CONTROLLER] Project List")
  $scope.newProjectData = {}
  $scope.newProject = false
  $scope.user = {
    userName: 'demo-user'
    displayName: 'Demo User'
  }

  AllProjectsService.promise($scope.user.userName, (projects) ->
    $scope.projects = projects)

  $scope.select_project = (pID) ->
    $rootScope.pID = pID

  $scope.new_project_toggle = ->
    $scope.newProject = !$scope.newProject
)