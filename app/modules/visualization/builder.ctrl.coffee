angular.module('diveApp.visualization').controller('BuilderCtrl', ($scope, $rootScope, DataService, PropertyService, pIDRetrieved) ->
  self = this

  # console.log("In BuilderCtrl!", projectCtrl)
  # UI Parameters
  self.functions = [
    title: 'Count' 
    value: 'count'
  , 
    title: 'Sum'
    value: 'sum'
  , 
    title: 'Minimum'
    value: 'min'
  ,
    title: 'Maximum'
    value: 'max'
  , 
    title: 'Average'
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

  # Contains all user selection data
  self.selectedParams =
    dataset: ''
    spec: ''
    conditional: []

  # self.$watch('selectedParams', (newVal, oldVal) ->
  #   console.log("SelectedParams changed", newVal)
  # , true)

  $scope.$watch((() -> self.selectedParams), (newVal, oldVal) ->
    console.log("SelectedParams changed", newVal)
  , true)

  self.onSelectDataset = (d) ->
    self.vizParameters.dataset = d
    self.attributes = self.attributesByDID[d.dID]

  self.onSelectFunction = (fn) ->
    self.selectedFunction = fn
    console.log("Selected Function", fn)

  self.onSelectOperator = (op) ->
    self.selectedOperation = op
    console.log("Selected Operation", op)

  self.getAttributes = () ->
    self.attributesByDID[self.selectedParams.dataset.dID]

  self.datasetsLoaded = false
  self.propertiesLoaded = false
  pIDRetrieved.promise.then((r) ->
    DataService.getDatasets({ pID: $rootScope.pID }).then((datasets) ->
      self.datasetsLoaded = true
      self.datasets = datasets
      self.selectedParams.dataset = datasets[0]
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