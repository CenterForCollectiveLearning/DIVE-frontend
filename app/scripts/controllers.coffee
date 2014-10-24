controllers = angular.module("engineControllers", ['ngAnimate'])

controllers.controller "CreateProjectFormController", ($scope, $http, $location) ->
  $scope.create_project = ->
    params = {
      title: $scope.newProjectData.title
      description: $scope.newProjectData.description
      user_name: $scope.user.userName
    }
    $http(
      method: 'POST'
      url: 'http://localhost:8888/api/project'
      data: params
      transformRequest: objectToQueryString
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    ).success((data, status) ->
      $location.path($scope.user.userName + '/' + data.formatted_title)
    ).error((data, status) ->
      # TODO Catch other types of errors
      $scope.titleTaken = true
      )

# Landing page project list / navigation
controllers.controller "ProjectListCtrl", ($scope, $http, $location, $rootScope, AllProjectsService) ->
  console.log("[CONTROLLER] Project List")
  $scope.newProjectData = {}
  $scope.newProject = false
  $scope.user = {
    userName: 'demo-user'
    displayName: 'Demo User'
  }

  AllProjectsService.promise($scope.user.userName, (projects) ->
    $scope.projects = projects)

  $scope.select_project = (pID) ->
    $rootScope.pID = pID

  $scope.new_project_toggle = ->
    $scope.newProject = !$scope.newProject

controllers.controller "OverviewCtrl", ($scope, $http, $state) ->
  console.log("[CONTROLLER] Overview")
  # TODO: How to deal with same method?
  $scope.removeProject = (pID) ->
    console.log('Removing project, pID:', pID)
    $http.delete('http://localhost:8888/api/project',
      params:
        pID: pID
    ).success((result) ->
      $state.go('landing')
    )

controllers.controller "PaneToggleCtrl", ($scope) ->
  $scope.leftClosed = false
  $scope.rightClosed = false
  $scope.toggleLeft = -> $scope.leftClosed = !$scope.leftClosed
  $scope.toggleRight = -> $scope.rightClosed = !$scope.rightClosed

# Stateful navigation (tabs)
controllers.controller "TabsCtrl", ($scope, $state, $rootScope, $stateParams) ->
  $scope.tabs = [
    {
      route: "engine.data"
      label: "1. Manage Datasets"
    }
    {
      route: "engine.ontology"
      label: "2. Edit Ontology"
    }
    {
      route: "engine.visualize"
      label: "3. Select Visualizations"
    }
    {
      route: "engine.assemble"
      label: "4. Assemble Engine"
    }
  ]

controllers.controller "DatasetListCtrl", ($scope, $rootScope, projectID, $http, $upload, $timeout, $stateParams, DataService) ->
  $scope.selectedIndex = 0
  $scope.currentPane = 'left'

  $scope.datasets = []

  $scope.options = [
    {
      label: 'Upload File'
      inactive: false
      icon: 'file.svg'
    },
    {
      label: 'Connect to Database'
      inactive: true
      icon: 'database.svg'
    },
    {
      label: 'Connect to API'
      inactive: true
      icon: 'link.svg'
    },
    {
      label: 'Search DIVE Datasets'
      inactive: true
      icon: 'search.svg'
    }
  ]
  $scope.select_option = (index) ->
    $scope.currentPane = 'left'
    # Inactive options (for demo purposes)
    unless $scope.options[index].inactive
      $scope.selectedIndex = index

  $scope.select_dataset = (index) ->
    $scope.currentPane = 'right'
    $scope.selectedIndex = index

  $scope.types = [ "integer", "float", "string", "country", "continent", "datetime" ]

  # Initialize datasets
  DataService.promise((datasets) ->
    $scope.datasets = datasets
    console.log($scope.datasets)
  )

  ###############
  # File Upload
  ###############
  $scope.onFileSelect = ($files) ->
    i = 0
    while i < $files.length
      file = $files[i]
      $scope.upload = $upload.upload(
        url: "http://localhost:8888/api/upload"
        data:
          pID: $rootScope.pID
        file: file
      ).progress((evt) ->
        console.log "Percent loaded: " + parseInt(100.0 * evt.loaded / evt.total)
        return
      ).success((data, status, headers, config) ->
        # file is uploaded successfully
        $scope.datasets.push(data)
      )
      i++
  ###############
  # File Deletion
  ###############
  $scope.removeDataset = (dID) ->
    console.log('Removing dataset, dID:', dID)
    $http.delete('http://localhost:8888/api/data',
      params:
        pID: $rootScope.pID
        dID: dID
    ).success((result) ->
      deleted_dIDs = result
      newDatasets = []
      for dataset in $scope.datasets
        unless dataset.dID in deleted_dIDs
          newDatasets.push(dataset)
      $scope.datasets = newDatasets
    )

controllers.controller "OntologyEditorCtrl", ($scope, $http, DataService, PropertyService) ->
  # Selected Element
  $scope.selected = null

  # Interface elements
  $scope.selectedLeftIndex = 0
  $scope.selectedRightIndex = 0
  $scope.currentPane = 'left'
  $scope.layoutOptions = [
    {
      label: 'Network'
      layout: 'network'
      inactive: false
      icon: 'network.svg'
    },
    {
      label: 'List'
      layout: 'list'
      inactive: true
      icon: 'list.svg'
    },
    {
      label: 'Hierarchy'
      layout: 'hierarchy'
      inactive: true
      icon: 'hierarchy.svg'
    }
  ]

  $scope.select_left_option = (index) ->
    $scope.selectedLeftIndex = index
    $scope.selectedLayout = $scope.layoutOptions[index].layout

  # Initialize datasets
  DataService.promise((datasets) ->
    $scope.datasets = datasets
    console.log('Datasets dIDs:', _.pluck($scope.datasets, 'dID'))
  )

  $scope.loading = true

  PropertyService.promise((properties) ->
    $scope.loading = false
    $scope.properties = properties
    $scope.overlaps = properties.overlaps
    $scope.hierarchies = properties.hierarchies
    $scope.uniques = properties.uniques
    $scope.stats = properties.stats
  )



# TODO Make this controller thinner!
controllers.controller "CreateVizCtrl", ($scope, $http, $rootScope, DataService, PropertyService, VizDataService, ConditionalDataService, SpecificationService) ->

  # Initialize datasets
  DataService.promise((datasets) ->
    console.log('Datasets dIDs:', _.pluck($scope.datasets, 'dID'))
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

controllers.controller "AssembleCtrl", ($scope, $http) ->
  return