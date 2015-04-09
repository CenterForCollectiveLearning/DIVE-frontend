var _ = require('underscore');

angular.module('diveApp.visualization').controller("CreateVizCtrl", function($scope, $http, $rootScope, DataService, PropertyService, VizDataService, ConditionalDataService, SpecificationService, API_URL) {
  $scope.categories = [];

  // Sidenav data
  $scope.sortFields = [
    {
      property: 'num_elements',
      display: 'Number of Elements'
    }, {
      property: 'std',
      display: 'Standard Deviation'
    }
  ];
  $scope.sortOrders = [
    {
      property: 1,
      display: 'Ascending'
    }, {
      property: -1,
      display: 'Descending'
    }
  ];
  $scope.filters = {
    sortField: $scope.sortFields[0].property,
    sortOrder: $scope.sortOrders[0].property
  }

  // Sidenav methods
  $scope.toggle = function(i) {
    $scope.categories[i].toggled = !$scope.categories[i].toggled;
  }

  $scope.isOpen = function(i) {
    return $scope.categories[i].toggled;
  }

  $scope.selectChild = function(c) {
    console.log(c);
    $scope.selectedChild = c;
  }

  $scope.isChildSelected = function(c) {
    return ($scope.selectedChild === c);
  }

  // Getting specifications grouped by category
  SpecificationService.promise(function(specs) {
    for (var k in specs) {
      var v = specs[k];
      $scope.categories.push({
        'name': k,
        'toggled': true,
        'length': v.length,
        'specs': v
      });
    }
    console.log($scope.categories);
  });
});