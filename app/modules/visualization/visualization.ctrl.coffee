_ = require('underscore')


# TODO Make this controller thinner!
angular.module('diveApp.visualization').controller "CreateVizCtrl", ($scope, $http, $rootScope, DataService, PropertyService, VizDataService, ConditionalDataService, SpecificationService, API_URL) ->

  icons =
    treemap: 'treemap.svg'
    barchart: 'barchart.svg'
    piechart: 'piechart.svg'
    geomap: 'geomap.svg'
    scatterplot: 'scatterplot.svg'
    linechart: 'linechart.svg'

  $scope.loading = true
  $scope.datasets = []
  $scope.columnAttrsByDID = {}

  DataService.promise((datasets) ->
    $scope.datasets = datasets
    for d in datasets
      dID = d.dID
      $scope.columnAttrsByDID[dID] = d.column_attrs
  )

  PropertyService.getProperties((properties) ->
    $scope.properties = properties
    $scope.overlaps = properties.overlaps
    $scope.hierarchies = properties.hierarchies
  )

  $scope.selectedTypeIndex = 0
  $scope.selectedSpecIndex = 0
  SpecificationService.promise((specs) ->
    $scope.types = ({'name': k, 'length': v.length, 'icon': icons[k.toLowerCase()]} for k, v of specs)
    $scope.allSpecs = specs
    $scope.selectedType = $scope.types[$scope.selectedTypeIndex].name

    $scope.specs = _.sortBy($scope.allSpecs[$scope.types[$scope.selectedTypeIndex].name], (e) ->
      $scope.selectedSortOrder * e['stats'][$scope.selectedSorting]
    )
    $scope.selectSpec(0)
    $scope.loading = false
  )

  $scope.chooseSpec = (index) ->
    spec = $scope.specs[index]
    console.log("Chose spec", spec.sID)
    $http.get(API_URL + '/api/choose_spec',
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
    $http.get(API_URL + '/api/reject_spec',
      params:
        pID: $rootScope.pID
        sID: $scope.specs[index].sID
    ).success((result) ->
      spec.chosen = false
    )

  $scope.selectType = (index) ->
    $scope.selectedTypeIndex = index
    $scope.selectedType = $scope.types[index].name
    $scope.specs = _.sortBy($scope.allSpecs[$scope.types[$scope.selectedTypeIndex].name], (e) ->
      $scope.selectedSortOrder * e['stats'][$scope.selectedSorting]
    )
    $scope.selectSpec(0)

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

    # Populate conditional info given spec
    $scope.condList = $scope.columnAttrsByDID[dID]
    $scope.condStats = $scope.properties.stats[dID]

    console.log("condList", $scope.condList)
    console.log("condStats", $scope.condStats)

    # Get visualization data
    params = 
      type: $scope.selectedType
      spec: $scope.selectedSpec
      conditional: $scope.selectedConditionalValues
    VizDataService.promise(params, (result) ->
      $scope.vizData = result.result
      $scope.loading = false
    )

  ###############################
  # Sortings
  ###############################
  $scope.sortings = [
    property: 'num_elements'
    display: 'Number of Elements'
  ,
    property: 'std'
    display: 'Standard Deviation'
  ]

  $scope.sortOrders = [
    property: 1
    display: 'Ascending'
  ,
    property: -1
    display: 'Descending'
  ]

  $scope.selectedSorting = $scope.sortings[0].property
  $scope.selectedSortOrder = $scope.sortOrders[0].property

  $scope.sortSpecs = ->
    console.log("sorting!")
    console.log($scope.specs)
    $scope.specs = _.sortBy($scope.specs, (e) ->
      $scope.selectedSortOrder * e['stats'][$scope.selectedSorting]
    )

  ###############################
  # Conditionals (TODO Refactor into directive)
  ###############################

  $scope.condList = []  # Conditional options by name for a given spec (loaded with all options on load)
  $scope.condStats = {}  # Stats about all conditionals for a given spec
  $scope.condData = {}  # Data corresponding to selected conditionals (k: list) (only loaded on conditional select)
  $scope.selectedCondValues = {}  # Selected values for selected conditionals


  # TODO Make the naming conventions clearer
  $scope.conditionalOptions = []  # All conditional {stats, types, name} for a given specification
  $scope.selectedConditionalData = {}  # Data corresponding to selected conditionals (k: list)
  $scope.selectedConditionalValues = {}  # { dID: { k: v } }
  $scope.selectedConditionalStats = {}  # { columnTitle: { stats } 
  $scope.selectedConditionalTypes = {}  # { columnTitle: type }
  $scope.selectedConditionalSliders = {}  # { columnTitle: { bottom: x, top: y } }

  $scope.isNumeric = (type) ->
    if type in ["float", "integer"] then true else false

  $scope.selectConditional = (spec) ->
    console.log("selectedConditional", spec)
    if spec.name of $scope.selectedConditionalData
      delete $scope.selectedConditionalData[spec.name]
    else
      console.log("SPEC:", spec)
      conditionalColumnID = spec.column_id
      conditionalName = spec.name
      $scope.selectedConditionalTypes[spec.name] = $scope.conditionalTypes[conditionalColumnID]
      $scope.selectedConditionalStats[spec.name] = $scope.conditionalStats[conditionalName]
      if $scope.isNumeric($scope.selectedConditionalTypes[spec.name])

        $scope.selectedConditionalValues[$scope.currentdID][spec.name] = {
          low: parseFloat(Math.floor($scope.selectedConditionalStats[spec.name].min))
          high: parseFloat(Math.ceil($scope.selectedConditionalStats[spec.name].max))
          min: parseFloat(Math.floor($scope.selectedConditionalStats[spec.name].min))
          max: parseFloat(Math.ceil($scope.selectedConditionalStats[spec.name].max))
          step: 1
        }
        

      ConditionalDataService.promise($scope.currentdID, spec, (result) ->
        data = result.result.unshift('All')
        $scope.selectedConditionalData[spec.name] = result.result
      )

      params = 
        type: $scope.selectedType
        spec: $scope.selectedSpec
        conditional: $scope.selectedConditionalValues
      VizDataService.promise(params, (result) ->
        console.log("CONDITIONAL CHANGE, params:", params.conditional)
        $scope.vizData = result.result
        $scope.loading = false
      )
    $scope.$broadcast('refreshSlider')

  $scope.item =
    cost: 10

  $scope.changedConditional = (title) ->

    params = 
      type: $scope.selectedType
      spec: $scope.selectedSpec
      conditional: $scope.selectedConditionalValues
    console.log("CONDITIONAL CHANGE, params:", params.conditional)
    VizDataService.promise(params, (result) ->
      $scope.vizData = result.result
      $scope.loading = false
    )

  $scope.selectedConditional = (name) ->
    if name of $scope.selectedConditionalData
      return true
    return false

