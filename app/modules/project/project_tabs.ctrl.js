var _ = require('underscore');

angular.module('diveApp.project').controller('ProjectTabsCtrl', function($scope, $state, $rootScope, $stateParams) {
  $scope.tabs = [
    {
      state: 'project.data.upload',
      label: 'Datasets'
    }, {
      state: 'project.visualize',
      label: 'Visualizations'
    }, {
      state: 'project.assemble',
      label: 'Reports'
    }, {
      state: 'project.overview',
      label: 'Overview'
    }
  ];

  var currentStateSplit = $state.current.name.split('.');
  var currentState = currentStateSplit[0] + '.' + currentStateSplit[1];
  $scope.selectedIndex = _.findIndex($scope.tabs, { state: currentState });
  $scope.$watch('selectedIndex', function(current, old) {
    if (current >= 0) {
      $state.go($scope.tabs[current].state);      
    }
  });
});