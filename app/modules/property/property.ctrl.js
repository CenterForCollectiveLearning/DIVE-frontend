angular.module('diveApp.property').controller("OntologyEditorCtrl", function($scope, $http, DataService, PropertyService) {
  $scope.selected = null;
  $scope.selectedLeftIndex = 0;
  $scope.selectedRightIndex = 0;
  $scope.currentPane = 'left';
  $scope.layoutOptions = [
    {
      label: 'Network',
      layout: 'network',
      inactive: false,
      icon: 'network.svg'
    }, {
      label: 'List',
      layout: 'list',
      inactive: true,
      icon: 'list.svg'
    }, {
      label: 'Hierarchy',
      layout: 'hierarchy',
      inactive: true,
      icon: 'hierarchy.svg'
    }
  ];
  $scope.select_left_option = function(index) {
    $scope.selectedLeftIndex = index;
    return $scope.selectedLayout = $scope.layoutOptions[index].layout;
  };
  DataService.promise(function(datasets) {
    return $scope.datasets = datasets;
  });
  $scope.loading = true;
  PropertyService.getProperties(function(properties) {
    $scope.loading = false;
    $scope.properties = properties;
    $scope.overlaps = properties.overlaps;
    $scope.hierarchies = properties.hierarchies;
    $scope.uniques = properties.uniques;
    $scope.stats = properties.stats;
  });
});