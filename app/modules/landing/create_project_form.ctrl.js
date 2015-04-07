angular.module('diveApp.landing').controller("CreateProjectFormCtrl", function($scope, $http, $location, API_URL) {
  return $scope.create_project = function() {
    var params;
    params = {
      title: $scope.newProjectData.title,
      description: $scope.newProjectData.description,
      user_name: $scope.user.userName
    };
    return $http({
      method: 'POST',
      url: API_URL + '/api/project',
      data: params,
      transformRequest: objectToQueryString,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).success(function(data, status) {
      return $location.path($scope.user.userName + '/' + data.formatted_title);
    }).error(function(data, status) {
      return $scope.titleTaken = true;
    });
  };
});