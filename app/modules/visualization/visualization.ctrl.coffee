# TODO Make this controller thinner!
angular.module('diveApp.visualization').controller "CreateVizCtrl", ($scope, $http, $rootScope, DataService, PropertyService, VizDataService, ConditionalDataService, SpecificationService) ->

  # Initialize datasets
  DataService.promise((datasets) ->
    $scope.datasets = datasets
    console.log($scope.datasets)
    $scope.datasetsByDID = {}
    for d in datasets
      dID = d.dID
      $scope.datasetsByDID[dID] = d.column_attrs
    console.log("cond options", $scope.conditionalOptions)
  )

  PropertyService.promise((properties) ->
    $scope.properties = properties
    $scope.overlaps = properties.overlaps
    $scope.hierarchies = properties.hierarchies
  )

  icons =
    treemap: 'treemap.svg'
    barchart: 'barchart.svg'
    piechart: 'piechart.svg'
    geomap: 'geomap.svg'
    scatterplot: 'scatterplot.svg'
    linechart: 'linechart.svg'

  $scope.selected_type_index = 0
  $scope.selected_spec_index = 0
  SpecificationService.promise((specs) ->
    $scope.types = ({'name': k, 'length': v.length, 'icon': icons[k.toLowerCase()]} for k, v of specs)
    $scope.allSpecs = specs
    $scope.selected_type = $scope.types[$scope.selected_type_index].name
    $scope.specs = $scope.allSpecs[$scope.types[$scope.selected_type_index].name]

    $scope.select_spec(0)
  )

  $scope.choose_spec = (index) ->
    spec = $scope.specs[index]
    console.log("Chose spec", spec.sID)
    $http.get('http://localhost:8888/api/choose_spec',
      params:
        pID: $rootScope.pID
        sID: spec.sID
        conditional: $scope.selectedConditionalValues
    ).success((result) ->
      spec.chosen = true
    )

  $scope.reject_spec = (index) ->
    spec = $scope.specs[index]
    console.log("Reject spec", spec.sID)
    $http.get('http://localhost:8888/api/reject_spec',
      params:
        pID: $rootScope.pID
        sID: $scope.specs[index].sID
    ).success((result) ->
      spec.chosen = false
    )

  $scope.select_type = (index) ->
    $scope.selected_type_index = index
    $scope.selected_type = $scope.types[index].name
    $scope.specs = $scope.allSpecs[$scope.types[index].name]

  $scope.select_spec = (index) ->
    $scope.selected_spec_index = index
    $scope.selected_spec = $scope.specs[index]

    if $scope.selected_spec.aggregate
      dID = $scope.selected_spec.aggregate.dID
    else
      dID = $scope.selected_spec.object.dID
    $scope.currentdID = dID
    unless $scope.selectedConditionalValues[dID]
      $scope.selectedConditionalValues[dID] = {}
    $scope.conditionalOptions = $scope.datasetsByDID[dID]
    console.log( $scope.conditionalData )

    VizDataService.promise($scope.selected_type, $scope.selected_spec, $scope.selectedConditionalValues, (result) ->
      $scope.vizData = result.result
      $scope.loading = false
    )

  ###############################
  # Conditionals (TODO Refactor into directive)
  ###############################
  $scope.conditionalOptions = []  # All conditionals by name
  $scope.selectedConditionalData = {}  # Data corresponding to selected conditionals (k: list)
  $scope.selectedConditionalValues = {}  # All selected conditional values (k: val)

  $scope.selectConditional = (spec) ->
    if spec.name of $scope.selectedConditionalData
      delete $scope.selectedConditionalData[spec.name]
    else
      ConditionalDataService.promise($scope.currentdID, spec, (result) ->
        data = result.result.unshift('All')
        $scope.selectedConditionalData[spec.name] = result.result
      )
      VizDataService.promise($scope.selected_type, $scope.selected_spec, $scope.selectedConditionalValues, (result) ->
        $scope.vizData = result.result
        $scope.loading = false
      )

  $scope.changedConditional = (title) ->
    VizDataService.promise($scope.selected_type, $scope.selected_spec, $scope.selectedConditionalValues, (result) ->
      $scope.vizData = result.result
      $scope.loading = false
    )

  $scope.selectedConditional = (name) ->
    if name of $scope.selectedConditionalData
      return true
    return false

