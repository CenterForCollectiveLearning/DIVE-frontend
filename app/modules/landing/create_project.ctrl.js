angular.module('diveApp.landing').controller("CreateProjectCtrl", function($scope, $http, $state, user, Config) {

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
      url: Config.API + '/api/project',
      data: params,
      transformRequest: objectToQueryString,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(data, status) {
      $state.go('project.data.upload', {
        formattedProjectTitle: data.formatted_title
      });
    }).error(function(data, status) {
      $scope.createProjectError = 'Title Taken';
    });
  };
});
