angular.module('diveApp.export').controller "AssembleCtrl", ($scope, $rootScope, $http, $state, $location, VizDataService, ExportedVizSpecService) ->
    $scope.conditionalOptions = []  # All conditionals by name
    $scope.selectedConditionalData = {}  # Data corresponding to selected conditionals (k: list)
    $scope.selectedConditionalValues = {}  # All selected conditional values (k: val)

    params = {}
    ExportedVizSpecService.promise(params, (specs) ->
        console.log("SPECS:", specs)
        $scope.specs = specs.result
        $scope.selectSpec(0)
    )

    $scope.selectSpec = (index) ->
        $scope.selectedSpecIndex = index
        $scope.selectedType = $scope.specs[index].spec.viz_type
        $scope.selectedSpec = $scope.specs[index].spec
        eID = $scope.specs[index].eID
        conditional = $scope.specs[index].conditional

        $scope.embedURL = $location.absUrl().split('//')[1].split('/')[0] + '/#' + $state.href('embed', {pID: $rootScope.pID, eID: eID})
    
        if $scope.selectedSpec.aggregate
            dID = $scope.selectedSpec.aggregate.dID
        else
            dID = $scope.selectedSpec.object.dID
        $scope.currentdID = dID
        unless $scope.selectedConditionalValues[dID]
            $scope.selectedConditionalValues[dID] = conditional[dID]
    
        params = 
            type: $scope.selectedType
            spec: $scope.selectedSpec
            conditional: $scope.selectedConditionalValues
        VizDataService.promise(params, (result) ->
            $scope.vizData = result.result
            $scope.loading = false
        )