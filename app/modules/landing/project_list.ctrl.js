angular.module('diveApp.landing').controller('ProjectListCtrl', function($scope, $http, $state, projects, AuthService, API_URL) {
  console.log("In ProjectListCtrl", projects);
  $scope.projects = projects;

  $scope.selectProject = function(pID) {
    if ($scope.selectedProject === pID) {
      return $scope.selectedProject = null;
    } else {
      return $scope.selectedProject = pID;
    }
  };
  $scope.openProject = function(project) {
    return $state.go('project.data.upload', {
      formattedUserName: AuthService.getCurrentUser().userName,
      formattedProjectTitle: project.formattedTitle
    });
  };
  $scope.removeProject = function(project, index) {
    var pID;
    pID = project.pID;
    console.log('Removing project, pID:', pID);
    $scope.projects.splice(index, 1);
    return $http["delete"](API_URL + '/api/project', {
      params: {
        pID: pID
      }
    }).success(function(result) {
      return console.log("Deleted project pID", pID);
    });
  };
  $scope.newProjectToggle = function() {
    return $scope.newProject = !$scope.newProject;
  };
});