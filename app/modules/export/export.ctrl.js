// Used for static export
$ = require('jquery');
FileSaver = require('filesaver');

angular.module('diveApp.export').controller('AssembleExportCtrl', function($scope) {
  console.log("EXPORT CTRL WHEEEE");
});

angular.module('diveApp.export').controller('AssembleSideNavCtrl', function($scope) {
  console.log("SIDE NAV CTRL SPECS: ", $scope.exportedVizData);
});

angular.module('diveApp.export').controller("AssembleCtrl", function($scope, $http, VizDataService, ExportedVizSpecService, API_URL, pID) {
  $scope.pID = pID;

  var params = {
    pID: $scope.pID
  };

  ExportedVizSpecService.getExportedVizData(params, function(data) {
    console.log("Exported visualizations:", data)
    var vizs = data.data.result;
    var numVizs = data.data.length;
    $scope.loadingData = true;
    $scope.exportedVizs = {};
    $scope.vizData = {}; // eID: data
    Object.keys(vizs).map(function(viz_type) {
      $scope.exportedVizs[viz_type] = vizs[viz_type].map(function(viz) {
        var params = {
          spec: viz.spec,
          conditional: viz.conditional,
          config: {}, // WHAT IS THIS???
          pID: $scope.pID
        };
        VizDataService.getVizData(params, function(data2) {
          $scope.vizData[viz.eID] = data2.result;
          $scope.loadingData = (Object.keys($scope.vizData).length == numVizs);
        });
        return {
          spec: viz.spec,
          conditional: viz.conditional,
          toggled: true,
          eID: viz.eID
        };
      });
    });
  });
});