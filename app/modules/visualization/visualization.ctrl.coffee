_ = require('underscore')

angular.module('diveApp.visualization').controller('VisualizationSideNavCtrl', ($scope) ->
  # Icons
  $scope.icons =
    'comparison': [ {
      'type': 'scatter'
      'url': 'scatterplot.svg'
    } ]
    'shares': [
      {
        'type': 'tree_map'
        'url': 'treemap.svg'
      }
      {
        'type': 'pie'
        'url': 'piechart.svg'
      }
    ]
    'time series': [ {
      'type': 'line'
      'url': 'linechart.svg'
    } ]
    'distribution': [ {
      'type': 'bar'
      'url': 'barchart.svg'
    } ]

  # Sidenav methods
  $scope.toggle = (i) ->
    $scope.categories[i].toggled = !$scope.categories[i].toggled

  $scope.isOpen = (i) ->
    $scope.categories[i].toggled

  # TODO Reconcile this with selectSpec
  $scope.selectChild = (c) ->
    $scope.selectedChild = c

  $scope.isChildSelected = (c) ->
    $scope.selectedChild == c

  $scope.selectType = (t) ->
    $scope.selectedType = t
)

angular.module('diveApp.visualization').controller('VisualizationConditionalsCtrl', ($scope, ConditionalDataService) ->

  $scope.selectConditional = (spec) ->
    if spec.name of $scope.selCondVals[$scope.currentdID]
      delete $scope.selCondVals[$scope.currentdID][spec.name]
    params = 
      dID: $scope.currentdID
      spec: _.omit(spec, 'stats')
      pID: $scope.pID
    ConditionalDataService.getConditionalData params, (result) ->
      result.result.unshift 'All'
      $scope.condData[spec.name] = result.result

    $scope.refreshVizData()
)

angular.module('diveApp.visualization').controller('VisualizationStatsCtrl', ($scope) ->
)

angular.module('diveApp.visualization').controller('VisualizationExportCtrl', ($scope, $mdToast, $animate, ExportedVizSpecService) ->
  $scope.toastPosition =
    bottom: false
    top: true
    left: false
    right: true

  $scope.getToastPosition = ->
    Object.keys($scope.toastPosition).filter((pos) ->
      $scope.toastPosition[pos]
    ).join ' '

  $scope.addToCollection = ->
    # Show toast
    $mdToast.show $mdToast.simple().content('Visualization added to collection').position($scope.getToastPosition()).hideDelay(3000)
    # Hit endpoint
    params = 
      pID: $scope.pID
      spec: $scope.selectedSpec
      conditional: $scope.selCondVals
    ExportedVizSpecService.exportVizSpec params, (data) ->
      console.log 'Exported viz spec: ', data

  $scope.shareInteractive = ->

  $scope.saveStatic = (format) ->
    tmp = document.getElementById('viz-container')
    svg = tmp.getElementsByTagName('svg')[0]
    svg_xml = (new XMLSerializer).serializeToString(svg)
    $http.post(API_URL + '/api/render_svg', data: JSON.stringify(
      format: format
      svg: svg_xml)).success (data) ->
      file = undefined
      file = new Blob([ data ], type: 'application/' + format)
      saveAs file, 'visualization.' + format
)

# Parent controller containing data functions
angular.module('diveApp.visualization').controller('VisualizationCtrl', ($scope, DataService, VizDataService, PropertyService, SpecificationService, ConditionalDataService, pIDRetrieved) ->
  # Making resolve data available to directives
  $scope.datasets = []
  $scope.columnAttrsByDID = {}
  $scope.categories = []
  # Selected visualization
  $scope.selectedCategory = null
  $scope.selectedType = null
  # Stats showing
  $scope.stats = shown: true
  # Loading
  $scope.loadingViz = false
  # CONDITIONALS
  $scope.condList = []
  $scope.condTypes = {}
  $scope.condData = {}
  $scope.selConds = {}
  # Which are selected to be shown
  $scope.selCondVals = {}
  # Selected values for conditionals
  # Default types given a category
  # TODO Don't put this all in a controller, maybe move to the server side?
  $scope.categoryToDefaultType =
    'time series': 'line'
    'comparison': 'scatter'
    'shares': 'tree_map'
    'distribution': 'bar'
  # TIME SERIES
  $scope.groupOn = []
  # CONFIG
  $scope.config = {}
  $scope.selectedValues = {}
  $scope.selectedParameters =
    x: ''
    y: ''
  pIDRetrieved.promise.then (r) ->
    DataService.getDatasets { pID: $scope.pID }, (datasets) ->
      $scope.datasets = datasets
      $scope.columnAttrsByDID = {}
      _.each datasets, (e) ->
        # Conditionals for time series visualizations
        if e.structure == 'wide'
          $scope.condList.push name: 'Start Date'
          $scope.condList.push name: 'End Date'
          $scope.condData['Start Date'] = e.time_series.names
          $scope.condData['End Date'] = e.time_series.names
        $scope.columnAttrsByDID[e.dID] = e.column_attrs
        return
      return
    # TODO Find a better way to resolve data dependencies without just making everything synchronous
    PropertyService.getProperties { pID: $scope.pID }, (properties) ->
      $scope.properties = properties
      $scope.overlaps = properties.overlaps
      $scope.hierarchies = properties.hierarchies
      # Getting specifications grouped by category
      SpecificationService.getSpecifications { pID: $scope.pID }, (specs) ->
        $scope.categories = _.map(specs, (v, k) ->
          {
            'name': k
            'toggled': true
            'length': v.length
            'specs': v
          }
        )
        $scope.selectSpec $scope.categories[1].specs[0]
        return
      return
    return

  $scope.selectSpec = (spec) ->
    $scope.selectedChild = spec
    $scope.selectedSpec = spec
    console.log 'SELECTING SPEC', spec.category, $scope.selectedCategory
    # If changing categories, select default type
    if spec.category != $scope.selectedCategory
      $scope.selectedCategory = spec.category
      $scope.selectedType = $scope.categoryToDefaultType[spec.category]
    if spec.aggregate
      dID = spec.aggregate.dID
    else
      dID = spec.object.dID
    $scope.currentdID = dID
    if !$scope.selCondVals[dID]
      $scope.selCondVals[dID] = {}
    colAttrs = $scope.columnAttrsByDID[dID]
    colStatsByName = $scope.properties.stats[dID]
    _.each colAttrs, (c) ->
      $scope.condTypes[c.name] = c.type
      if c.name of colStatsByName
        c.stats = colStatsByName[c.name]
      if !$scope.isNumeric(c.type)
        $scope.condList.push c
      if $scope.isNumeric(c.type)
        $scope.groupOn.push c
      return
    $scope.loadingViz = true
    $scope.refreshVizData()

  # Sidenav data
  $scope.sortFields = [
    {
      property: 'num_elements'
      display: 'Number of Elements'
    }
    {
      property: 'std'
      display: 'Standard Deviation'
    }
  ]
  $scope.sortOrders = [
    {
      property: 1
      display: 'Ascending'
    }
    {
      property: -1
      display: 'Descending'
    }
  ]
  $scope.filters =
    sortField: $scope.sortFields[0].property
    sortOrder: $scope.sortOrders[0].property
  # Watch changes in the configuration
  # TODO Don't run initially
  $scope.$watch('config', ((config) ->
    $scope.refreshVizData()
    return
  ), true)

  $scope.isNumeric = (type) ->
    if type == 'float' or type == 'integer'
      true
    else
      false

  $scope.refreshVizData = ->
    type = $scope.selectedType
    spec = _.omit($scope.selectedSpec, 'stats')
    conditional = $scope.selCondVals
    config = $scope.config
    # Require parameters before refreshing vizData
    if !type or !spec
      return
    $scope.loadingViz = true
    # var filteredSelCondVals = {}
    # _.each($scope.selCondVals, function(v, k) {
    #   if ($scope.selConds[k]) {
    #     filteredSelCondVals[k] = v;
    #   }
    # })
    params = 
      type: type
      spec: spec
      conditional: conditional
      config: config
      pID: $scope.pID
    VizDataService.getVizData params, (result) ->
      $scope.vizData = result.result
      $scope.vizStats = result.stats
      $scope.loadingViz = false
      if 'stats' of result
        means = result.stats.means
        if 'means' of result.stats
          selectedValues = {}
          sortedMeans = Object.keys(means).sort((a, b) ->
            means[b] - (means[a])
          )
          _.each sortedMeans, (e, i) ->
            selectedValues[e] = if i < 10 then true else false
           $scope.selectedValues = selectedValues
)