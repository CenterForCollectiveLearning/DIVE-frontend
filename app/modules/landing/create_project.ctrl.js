angular.module('diveApp.landing').controller("CreateProjectCtrl", function($scope, $http, $state, user, API_URL) {

  $scope.createProjectError = '';

  $scope.projectData = {
    title: null,
    description: null
  }

  $scope.createProject = function() {
    var params = {
      title: $scope.projectData.title,
      description: $scope.projectData.description,
      user_name: user.userName
    };
    console.log("Creating project");
    $http({
      method: 'POST',
      url: API_URL + '/api/project',
      data: params,
      transformRequest: objectToQueryString,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(data, status) {
      $state.go('project.data.upload', { 
        formattedUserName: user.userName, 
        formattedProjectTitle: data.formatted_title
      });
    }).error(function(data, status) {
      $scope.createProjectError = 'Title Taken';
    });
  };
});