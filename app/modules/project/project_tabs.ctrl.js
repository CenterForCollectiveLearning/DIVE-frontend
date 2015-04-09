angular.module('diveApp.project').controller('ProjectTabsCtrl', function($scope, $state, $rootScope, $stateParams) {
  $scope.tabs = [
    {
      route: 'project.data',
      label: 'Manage Datasets'
    }, {
      route: 'project.visualize',
      label: 'Select Visualizations'
    }, {
      route: 'project.assemble',
      label: 'Edit and Export'
    }, {
      route: 'project.ontology',
      label: 'Edit Ontology'
    }, {
      route: 'project.overview',
      label: 'Project Overview'
    }
  ];
  $scope.selectedIndex = 1;
  $scope.$watch('selectedIndex', function(current, old) {
    $state.go($scope.tabs[current].route);
  });
});