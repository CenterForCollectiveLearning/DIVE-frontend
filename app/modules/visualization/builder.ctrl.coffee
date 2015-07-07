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

  $scope.spec = 
    aggregate: ''
    condition: []
    query: ''

  $scope.onSelectDataset = (ds) ->
    console.log("$scope.selectedDataset", $scope.selectedDataset)
    $scope.selectedDataset = ds
    $scope.attributes = $scope.attributesByDID[ds.dID]

  $scope.onSelectFunction = (fn) ->
    $scope.selectedFunction = fn
    console.log("Selected Function", fn)

  $scope.onSelectOperator = (op) ->
    $scope.selectedOperation = op
    console.log("Selected Operation", op)

  $scope.datasetsLoaded = false
  $scope.propertiesLoaded = false
  pIDRetrieved.promise.then((r) ->
    DataService.getDatasets({ pID: $scope.pID }).then((datasets) ->
      $scope.datasetsLoaded = true
      $scope.datasets = datasets
      console.log($scope.datasets)
    )
   
    # TODO Find a better way to resolve data dependencies without just making everything synchronous
    PropertyService.getProperties({ pID: $scope.pID }).then((properties) ->
      $scope.propertiesLoaded = true
      $scope.attributesByDID = properties.attributes
      $scope.types = properties.types
      console.log($scope.attributes, $scope.types)
    )
  )


)