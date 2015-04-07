# Landing page project list / navigation
angular.module('diveApp.landing').controller("ProjectListCtrl", ($scope, $http, $state, $rootScope, AllProjectsService, UserService, API_URL) ->
  console.log("[CONTROLLER] Project List")

  init = () ->
    $scope.newProjectData = {}
    $scope.newProject = false
    $scope.selectedProject = null
    $scope.user = UserService.getCurrentUser(true)
    $scope.loggedIn = Boolean($scope.user.userName)
    $scope.loginErr = false
    $scope.regErr = false
    
    if ($scope.loggedIn)
      AllProjectsService.promise($scope.user.userName, (projects) ->
        console.log "Projects retrieved", projects
        $scope.projects = projects
      )

  $scope.loginUser = (userName, password) ->
    if (userName && password)
      UserService.loginUser(userName, password, (data) ->
        if (data['success'] == 1)
          $scope.loggedIn = true        
          $scope.user = UserService.getCurrentUser()
                
          AllProjectsService.promise($scope.user.userName, (projects) ->
            $scope.projects = projects
          )
        else 
          $scope.loginErr = true
      )
    else
      $scope.loginErr = true

  $scope.registerUser = (userName, displayName, password) ->

    if (userName && displayName && password)

      UserService.registerUser(userName, displayName, password, (data) ->
        # console.log "Successfully registered user: ", data
        if (data['success'] == 1)
          $scope.loginUser(userName, password)
        else 
          $scope.regErr = true
      )
      
    else
      $scope.regErr = true

  $scope.logoutUser = () ->
    # console.log userName
    UserService.logoutUser(() ->
      $scope.user = UserService.getCurrentUser()
      init()
    )

  $scope.selectProject = (pID) ->
    if $scope.selectedProject is pID
      $scope.selectedProject = null
    else
      $scope.selectedProject = pID

  $scope.openProject = (project) ->
    $state.go('project.overview',
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

  init()
)