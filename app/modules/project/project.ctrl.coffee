angular.module('diveApp.project').controller('ProjectCtrl', ($scope, $rootScope, $state, $stateParams, $q, $cookies, AuthService, ProjectIDService, ProjectService, user, loggedIn, projectParams, pIDRetrieved) ->
  self = this

  if projectParams.refresh
    $state.go 'project.data.upload', formattedProjectTitle: projectParams.title
    return

  console.log("In ProjectCtrl")

  $scope.projectTitle = projectParams.title.split('-').join(' ')
  $rootScope.user = user
  $rootScope.loggedIn = loggedIn

  # TODO: should check for user permissions to this project
  # we should be able to mark whether this project is dirty or clean somehow

  setPID = (_pID) ->
    $rootScope.pID = _pID
    $scope.pID = _pID
    self.pID = _pID
    if !$scope.pID
      ProjectService.createProject(
        anonymous: true
        title: projectParams.title
        user_name: user.userName
      ).then (r) ->
        $cookies._title = projectParams.title
        $cookies._pID = r.data.pID
        $scope.pID = r.data.pID
        pIDRetrieved.q.resolve()
        return
    else
      $cookies._title = projectParams.title
      $cookies._pID = _pID
      pIDRetrieved.q.resolve()
    return

  if $cookies._pID
    setPID($cookies._pID)
  else
    ProjectIDService.getProjectID(
      formattedProjectTitle: projectParams.title
      userName: user.userName
    ).then (_pID) ->
      setPID(_pID)

  # Necessary for ui-router controllerAs
  return self
)