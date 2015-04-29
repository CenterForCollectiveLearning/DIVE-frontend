var _ = require('underscore');

angular.module('diveApp.project').controller('ProjectTabsCtrl', function($scope, $state, $rootScope, $stateParams) {
  $scope.tabs = [
    {
      route: 'project.data',
      label: 'Datasets'
    }, {
      route: 'project.visualize',
      label: 'Visualizations'
    }, {
      route: 'project.assemble',
      label: 'Reports'
    }, {
      route: 'project.overview',
      label: 'Overview'
    }
  ];

  var currentRoutePage = $state.current.name.split('.')[1];
  $scope.selectedIndex = _.findIndex($scope.tabs, { route: currentRoutePage });
  // $scope.$watch('selectedIndex', function(current, old) {
  //   $state.go($scope.tabs[current].route);
  // });
});