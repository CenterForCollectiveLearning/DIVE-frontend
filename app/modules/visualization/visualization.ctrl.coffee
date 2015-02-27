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
        conditional: $scope.selCondVals
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
    unless $scope.selCondVals[dID]
      $scope.selCondVals[dID] = {}

    # Populate conditional info given spec
    colAttrs = $scope.columnAttrsByDID[dID]
    colStatsByName = $scope.properties.stats[dID]
    $scope.condList = []
    for cond in colAttrs
      name = cond.name

      $scope.condTypes[name] = cond.type

      if name of colStatsByName
        cond.stats = colStatsByName[name]
      $scope.condList.push(cond)

    # Get visualization data
    params = 
      type: $scope.selectedType
      spec: $scope.selectedSpec
      conditional: $scope.selCondVals
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

  $scope.condList = []  # Conditional {stats, types, name, data} for a given spec (loaded with all options on load)
  $scope.condTypes = {}
  $scope.condData = {}
  $scope.selCondVals = {}  # Selected values for selected conditionals

  $scope.isNumeric = (type) ->
    if type in ["float", "integer"] then true else false

  $scope.selectConditional = (spec) ->
    if spec.name of $scope.condData
      delete $scope.condData[spec.name]
    else
      if $scope.isNumeric(spec.type)
        # What is the dID from?
        # Where do we need to put in dID?
        low = parseFloat(Math.floor(spec.stats.min))
        high = parseFloat(Math.floor(spec.stats.max))
        $scope.condData[spec.name] =
          step: 1
          floor: low
          ceiling: high

        $scope.selCondVals[$scope.currentdID][spec.name] =
          type: 'numeric'
          low: low
          high: high
      else
        ConditionalDataService.promise($scope.currentdID, spec, (result) ->
          data = result.result.unshift('All')
          $scope.condData[spec.name] = result.result
        )

      params = 
        type: $scope.selectedType
        spec: $scope.selectedSpec
        conditional: $scope.selCondVals
      VizDataService.promise(params, (result) ->
        $scope.vizData = result.result
        $scope.loading = false
      )

    $scope.$broadcast('refreshSlider')

  $scope.changedConditional = (title) ->
    params = 
      type: $scope.selectedType
      spec: $scope.selectedSpec
      conditional: $scope.selCondVals
    VizDataService.promise(params, (result) ->
      $scope.vizData = result.result
      $scope.loading = false
    )

  $scope.selectedConditional = (name) ->
    if name of $scope.condData
      return true
    return false