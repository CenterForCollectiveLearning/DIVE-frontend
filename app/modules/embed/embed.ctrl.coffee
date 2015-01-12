angular.module('diveApp.embed').controller "EmbedCtrl", ($scope, $http, $stateParams, VizDataService, ExportedVizSpecService) ->
    console.log("pID", $stateParams.pID, "sID", $stateParams.sID)

    # Get full vizSpec from sID
    params = 
        pID: $stateParams.pID
        sID: $stateParams.sID
    ExportedVizSpecService.promise(params, (result) ->
        spec = result.result[0]
        $scope.selectedType = spec.viz_type
        $scope.selectedSpec = spec
        $scope.selectedConditionalValues = spec.condition

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

