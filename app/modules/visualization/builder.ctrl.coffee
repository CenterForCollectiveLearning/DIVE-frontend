angular.module('diveApp.visualization').controller('BuilderCtrl', ($scope, DataService, PropertyService, pIDRetrieved) ->
  console.log("In BuilderCtrl!")
  # UI Parameters
  $scope.functions = [
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

  $scope.operators = [
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

  $scope.selectedParams =
    dataset: ''
    spec: ''

  $scope.onSelectDataset = (d) ->
    $scope.vizParameters.dataset = d
    $scope.attributes = $scope.attributesByDID[d.dID]

  $scope.onSelectFunction = (fn) ->
    $scope.selectedFunction = fn
    console.log("Selected Function", fn)

  $scope.onSelectOperator = (op) ->
    $scope.selectedOperation = op
    console.log("Selected Operation", op)

  $scope.getAttributes = () ->
    $scope.attributesByDID[$scope.selectedParams.dataset.dID]

  $scope.datasetsLoaded = false
  $scope.propertiesLoaded = false
  pIDRetrieved.promise.then((r) ->
    DataService.getDatasets({ pID: $scope.pID }).then((datasets) ->
      $scope.datasetsLoaded = true
      $scope.datasets = datasets
      $scope.selectedParams.dataset = datasets[0]
    )
   
    # TODO Find a better way to resolve data dependencies without just making everything synchronous
    PropertyService.getProperties({ pID: $scope.pID }).then((properties) ->
      $scope.propertiesLoaded = true
      $scope.attributesByDID = properties.attributes
      $scope.types = properties.types
    )
  )


)