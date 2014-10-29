# Stateful navigation (tabs)
angular.module('diveApp.project').controller 'TabsCtrl', ($scope, $state, $rootScope, $stateParams) ->
  $scope.tabs = [
    {
      route: 'engine.data'
      label: '1. Manage Datasets'
    }
    {
      route: 'engine.ontology'
      label: '2. Edit Ontology'
    }
    {
      route: 'engine.visualize'
      label: '3. Select Visualizations'
    }
    {
      route: 'engine.assemble'
      label: '4. Assemble Engine'
    }
  ]
