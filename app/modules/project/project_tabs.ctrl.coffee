# Stateful navigation (tabs)
angular.module('diveApp.project').controller 'ProjectTabsCtrl', ($scope, $state, $rootScope, $stateParams) ->
  $scope.tabs = [
    {
      route: 'project.data'
      label: 'Manage Datasets'
    }
    {
      route: 'project.visualize'
      label: 'Select Visualizations'
    }
    {
      route: 'project.assemble'
      label: 'Edit and Export'
    }
    {
      route: 'project.ontology'
      label: 'Edit Ontology'
    }
    {
      route: 'project.overview'
      label: 'Project Overview'
    }
  ]
  $scope.selectedIndex = 0
  $scope.$watch('selectedIndex', (current, old) ->
    $state.go($scope.tabs[current].route)
  )