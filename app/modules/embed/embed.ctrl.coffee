angular.module('diveApp.embed').controller "EmbedCtrl", ($scope, $http, $stateParams, VizDataService, ExportedVizSpecService) ->
    console.log("pID", $stateParams.pID, "eID", $stateParams.eID)

    # Get full vizSpec from eID
    params = 
        pID: $stateParams.pID
        eID: $stateParams.eID
    ExportedVizSpecService.promise(params, (result) ->
        spec = result.result[0]
        $scope.selectedType = spec.spec.viz_type
        $scope.selectedSpec = spec.spec
        $scope.selectedConditionalValues = spec.conditional

        # Get vizData from vizSpec
        params = 
            pID: $stateParams.pID
            type: $scope.selectedType
            spec: $scope.selectedSpec
            conditional: $scope.selectedConditionalValues
        VizDataService.promise(params, (result) ->
            $scope.vizData = result.result
            console.log("vizData", $scope.vizData)
            $scope.loading = false
        )
    )

