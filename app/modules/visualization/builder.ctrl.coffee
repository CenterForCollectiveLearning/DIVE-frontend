angular.module('diveApp.visualization').controller('BuilderCtrl', ($scope, $rootScope, DataService, PropertyService, VisualizationDataService, pIDRetrieved) ->
  self = this

  # UI Parameters
  self.aggregationFunctions = [
    title: 'sum'
    value: 'sum'
  , 
    title: 'minimum'
    value: 'min'
  ,
    title: 'maximum'
    value: 'max'
  , 
    title: 'average'
    value: 'avg'
  ]

  self.operators = [
    title: '=' 
    value: '=='
  , 
    title: '≠'
    value: '!='
  , 
    title: '>'
    value: '>'
  ,
    title: '≥'
    value: '>='
  , 
    title: '<'
    value: '<'
  ,
    title: '<='
    value: '≤'
  ]

  self.operations = [
    title: 'grouped on'
    value: 'group'
  ,
    title: 'vs'
    value: 'vs'
  ,
    title: 'compare'
    value: 'compare'
  ]

  self.selectedDataset = null

  self.selectedParams =
    dID: ''
    field_a: ''
    operation: self.operations[0].value
    arguments:
      field_b: "count"
      function: self.aggregationFunctions[0].value

  self.selectedConditional =
    'and': []
    'or': []

  $scope.$watch((() -> self.selectedParams), (newVal, oldVal) ->
    console.log("SelectedParams changed", newVal)
  , true)

  self.onSelectDataset = (d) ->
    self.attributes = self.attributesByDID[d.dID]

  self.onSelectFunction = (fn) ->
    self.selectedFunction = fn
    console.log("Selected Function", fn)

  self.onSelectOperator = (op) ->
    self.selectedOperation = op
    console.log("Selected Operation", op)

  self.refreshVisualization = () ->
    _params =
      spec: self.selectedParams
      conditional: self.selectedConditional

    VisualizationDataService.getVisualizationData(_params).then((data) =>
      self.visualizationData = data.viz_data
      self.tableData = data.table_result
    )

  self.onSelectFieldA = () ->
    self.refreshVisualization()

  self.onSelectFieldB = () ->
    self.refreshVisualization()

  self.getAttributes = (secondary = false) ->
    _attr = self.attributesByDID[self.selectedDataset.dID].slice()

    if secondary
      _index = _attr.indexOf(self.selectedParams.field_a)
      _attr.splice(_index, 1)
      _attr.unshift('count')

    return _attr

  self.datasetsLoaded = false
  self.propertiesLoaded = false

  pIDRetrieved.promise.then((r) ->
    DataService.getDatasets().then((datasets) ->
      self.datasetsLoaded = true
      self.datasets = datasets
      self.selectedDataset = datasets[0]
      self.selectedParams.dID = self.selectedDataset.dID
      console.log("Datasets loaded!", self.datasets)
    )
   
    # TODO Find a better way to resolve data dependencies without just making everything synchronous
    PropertyService.getProperties({ pID: $rootScope.pID }).then((properties) ->
      self.propertiesLoaded = true
      self.attributesByDID = properties.attributes
      self.types = properties.types
      console.log("Properties loaded!", self.attributesByDID)
    )
  )
  return self
)
