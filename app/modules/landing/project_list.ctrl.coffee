# Landing page project list / navigation
angular.module('diveApp.landing').controller("ProjectListCtrl", ($scope, $http, $location, $rootScope, AllProjectsService) ->
  console.log("[CONTROLLER] Project List")
  $scope.newProjectData = {}
  $scope.newProject = false
  $scope.selectedProject = null
  $scope.user = {
    userName: 'demo-user'
    displayName: 'Demo User'
  }

  AllProjectsService.promise($scope.user.userName, (projects) ->
    $scope.projects = projects)


  $scope.selectProject = (pID) ->
    if $scope.selectedProject is pID
      $scope.selectedProject = null
    else
      $scope.selectedProject = pID

  $scope.openProject = (project) ->
    $location.path('/' + $scope.user.userName + '/' + project.formattedTitle)

  $scope.newProjectToggle = ->
    $scope.newProject = !$scope.newProject
)