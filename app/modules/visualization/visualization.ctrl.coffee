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

  $scope.selectedTypeIndex = 0
  $scope.selectedSpecIndex = 0
  SpecificationService.promise((specs) ->
    $scope.types = ({'name': k, 'length': v.length, 'icon': icons[k.toLowerCase()]} for k, v of specs)
    $scope.allSpecs = specs
    $scope.selectedType = $scope.types[$scope.selectedTypeIndex].name
    $scope.specs = $scope.allSpecs[$scope.types[$scope.selectedTypeIndex].name]

    $scope.selectSpec(0)
  )

  $scope.chooseSpec = (index) ->
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

  $scope.rejectSpec = (index) ->
    spec = $scope.specs[index]
    console.log("Reject spec", spec.sID)
    $http.get('http://localhost:8888/api/reject_spec',
      params:
        pID: $rootScope.pID
        sID: $scope.specs[index].sID
    ).success((result) ->
      spec.chosen = false
    )

  $scope.selectType = (index) ->
    $scope.selectedTypeIndex = index
    $scope.selectedType = $scope.types[index].name
    $scope.specs = $scope.allSpecs[$scope.types[index].name]

  $scope.selectSpec = (index) ->
    $scope.selectedSpecIndex = index
    $scope.selectedSpec = $scope.specs[index]

    if $scope.selectedSpec.aggregate
      dID = $scope.selectedSpec.aggregate.dID
    else
      dID = $scope.selectedSpec.object.dID
    $scope.currentdID = dID
    unless $scope.selectedConditionalValues[dID]
      $scope.selectedConditionalValues[dID] = {}
    $scope.conditionalOptions = $scope.datasetsByDID[dID]
    console.log( $scope.conditionalData )

    params = 
      type: $scope.selectedType
      spec: $scope.selectedSpec
      conditional: $scope.selectedConditionalValues
    VizDataService.promise(params, (result) ->
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
      params = 
        type: $scope.selectedType
        spec: $scope.selectedSpec
        conditional: $scope.selectedConditionalValues
      VizDataService.promise(params, (result) ->
        $scope.vizData = result.result
        $scope.loading = false
      )

  $scope.changedConditional = (title) ->
    params = 
      type: $scope.selectedType
      spec: $scope.selectedSpec
      conditional: $scope.selectedConditionalValues
    VizDataService.promise(params, (result) ->
      $scope.vizData = result.result
      $scope.loading = false
    )

  $scope.selectedConditional = (name) ->
    if name of $scope.selectedConditionalData
      return true
    return false

