var _ = require('underscore');

angular.module('diveApp.project').controller('ProjectTabsCtrl', function($scope, $state, $rootScope, $stateParams) {
  $scope.rightPaneOpen = false;
  $scope.tabs = [
    {
      state: 'project.data.upload',
      label: 'Datasets'
    }, {
      state: 'project.visualize',
      label: 'Visualizations'
    }, {
      state: 'project.export',
      label: 'Export'
    }, {
      state: 'project.overview',
      label: 'Overview'
    }
  ];

  var currentStateSplit = $state.current.name.split('.');
  var currentState = currentStateSplit[0] + '.' + currentStateSplit[1];
  $scope.selectedIndex = _.findIndex($scope.tabs, { state: currentState });
  $scope.$watch('selectedIndex', function(current, old) {
    if (current >= 0 && old >= 0 && current != old) {
      $state.go($scope.tabs[current].state);
    }
  });

  $scope.toggleRightPane = function() {
    $scope.rightPaneOpen = !$scope.rightPaneOpen;
  };
});
