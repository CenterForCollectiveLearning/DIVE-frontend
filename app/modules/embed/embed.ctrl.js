angular.module('diveApp.embed').controller("EmbedCtrl", function($scope, $http, $stateParams, VizDataService, ExportedVizSpecService) {
  var params;
  console.log("pID", $stateParams.pID, "sID", $stateParams.sID);
  params = {
    pID: $stateParams.pID,
    sID: $stateParams.sID
  };
  return ExportedVizSpecService.promise(params, function(result) {
    var spec;
    spec = result.result[0];
    $scope.selectedType = spec.viz_type;
    $scope.selectedSpec = spec;
    $scope.selectedConditionalValues = spec.condition;
    params = {
      pID: $stateParams.pID,
      type: $scope.selectedType,
      spec: $scope.selectedSpec,
      conditional: $scope.selectedConditionalValues
    };
    return VizDataService.promise(params, function(result) {
      $scope.vizData = result.result;
      console.log("vizData", $scope.vizData);
      return $scope.loading = false;
    });
  });
});