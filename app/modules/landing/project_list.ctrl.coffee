# Landing page project list / navigation
angular.module('diveApp.landing').controller("ProjectListCtrl", ($scope, $http, $state, $rootScope, AllProjectsService, API_URL) ->
  console.log("[CONTROLLER] Project List")
  $scope.newProjectData = {}
  $scope.newProject = false
  $scope.selectedProject = null
  $scope.user = {
    userName: 'demo-user'
    displayName: 'Demo User'
  }

  AllProjectsService.promise($scope.user.userName, (projects) ->
    $scope.projects = projects
  )

  $scope.selectProject = (pID) ->
    if $scope.selectedProject is pID
      $scope.selectedProject = null
    else
      $scope.selectedProject = pID

  $scope.openProject = (project) ->
    $state.go('engine.overview', 
      formattedUserName: $scope.user.userName
      formattedProjectTitle: project.formattedTitle
    )

  $scope.removeProject = (project, index) ->
    pID = project.pID
    console.log('Removing project, pID:', pID)
    $scope.projects.splice(index, 1)

    # TODO Turn this into a service
    $http.delete(API_URL + '/api/project',
      params:
        pID: pID
    ).success((result) ->
      console.log("Deleted project pID", pID)
    )

  $scope.newProjectToggle = ->
    $scope.newProject = !$scope.newProject
)