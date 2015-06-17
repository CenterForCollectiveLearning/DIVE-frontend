// Used for static export
$ = require('jquery');
FileSaver = require('filesaver');
_ = require('underscore');

angular.module('diveApp.visualization').controller("ExportSideNavCtrl", function($scope) {
  // Icons
  $scope.icons = {
    'comparison': [
      { 'type': 'scatter', 'url': 'scatterplot.svg'}
    ],
    'shares': [
      { 'type': 'tree_map', 'url': 'treemap.svg'},
      { 'type': 'pie', 'url': 'piechart.svg'},
    ],
    'time series': [
      { 'type': 'line', 'url': 'linechart.svg'}
    ],
    'distribution': [
      { 'type': 'bar', 'url': 'barchart.svg'}
    ]
  }

  // Sidenav methods
  $scope.toggle = function(i) {
    $scope.categories[i].toggled = !$scope.categories[i].toggled;
  }

  $scope.isOpen = function(i) {
    return $scope.categories[i].toggled;
  }

  // TODO Reconcile this with selectSpec
  $scope.selectChild = function(c) {
    $scope.selectedChild = c;
  }

  $scope.isChildSelected = function(c) {
    return ($scope.selectedChild === c);
  }

  $scope.selectType = function(t) {
    $scope.selectedType = t;
  }
});  


angular.module('diveApp.export').controller("ExportCtrl", function($scope, $http, VizDataService, ExportedVizSpecService, API_URL, pID) {
  $scope.pID = pID;
  $scope.exportedSpecs = [];

  // Get exported specs
  ExportedVizSpecService.getExportedVizData({ pID: $scope.pID }, function(data) {
    var exportedVizDocsByCategory = data.data.result;
    $scope.exportedSpecs = exportedVizDocsByCategory;
    var numVizSpecs = data.data.length;

    // Get data for exported specs
    $scope.loadingData = true;
    $scope.exportedVizs = {};
    $scope.vizData = {};

    _.each(exportedVizDocsByCategory, function(docs, category) {
      _.each(docs, function(doc) {
        var params = {
          spec: doc.spec,
          conditional: doc.conditional,
          config: {},
          pID: $scope.pID
        };

        VizDataService.getVizData(params, function(data) {
          $scope.vizData[doc.eID] = data.result;
          $scope.loadingData = (Object.keys($scope.vizData).length === numVizSpecs);
        });
      });
    });
  });
});