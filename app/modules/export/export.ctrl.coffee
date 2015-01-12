angular.module('diveApp.export').directive('selectOnClick', ->
    return {
        restrict: 'A'
        link: (scope, element, attrs) ->
            element.on('click', -> this.select())
        }
)

angular.module('diveApp.export').controller "AssembleCtrl", ($scope, $rootScope, $http, $state, $location, VizDataService, ExportedVizSpecService) ->
    $scope.conditionalOptions = []  # All conditionals by name
    $scope.selectedConditionalData = {}  # Data corresponding to selected conditionals (k: list)
    $scope.selectedConditionalValues = {}  # All selected conditional values (k: val)

    $scope.icons =
        treemap: 'treemap.svg'
        barchart: 'barchart.svg'
        piechart: 'piechart.svg'
        geomap: 'geomap.svg'
        scatterplot: 'scatterplot.svg'
        linechart: 'linechart.svg'

    params = {}
    ExportedVizSpecService.promise(params, (specs) ->
        console.log("SPECS:", specs)
        $scope.specs = specs.result
        $scope.selectSpec(0)
    )

    $scope.selectSpec = (index) ->
        $scope.selectedSpecIndex = index
        $scope.selectedType = $scope.specs[index].viz_type
        $scope.selectedSpec = $scope.specs[index]
        sID = $scope.specs[index].sID
        condition = $scope.specs[index].condition

        $scope.embedURL = $location.absUrl().split('//')[1].split('/')[0] + '/#' + $state.href('embed', {pID: $rootScope.pID, sID: sID})
        $scope.embedHTML = '<iframe width="560" height="315" src="' + $scope.embedURL + '" frameborder="0" allowfullscreen></iframe>'
    
        if $scope.selectedSpec.aggregate
            dID = $scope.selectedSpec.aggregate.dID
        else
            dID = $scope.selectedSpec.object.dID
        $scope.currentdID = dID
        unless $scope.selectedConditionalValues[dID]
            $scope.selectedConditionalValues[dID] = condition[dID]
    
        params = 
            type: $scope.selectedType
            spec: $scope.selectedSpec
            conditional: $scope.selectedConditionalValues
        VizDataService.promise(params, (result) ->
            $scope.vizData = result.result
            $scope.loading = false
        )