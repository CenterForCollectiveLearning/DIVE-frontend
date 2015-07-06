angular.module('diveApp.visualization').controller('BuilderCtrl', ($scope, DataService, PropertyService, pIDRetrieved) ->
  console.log("In BuilderCtrl!")
  # UI Parameters
  $scope.functions = 
    'count': 'count'
    'sum': 'sum'
    'minimum': 'min'
    'maximum': 'max'
    'average': 'avg'

  pIDRetrieved.promise.then((r) ->
    DataService.getDatasets({ pID: $scope.pID }).then((datasets) ->
      $scope.datasets = datasets
      # TODO Get column attributes
      $scope.columnAttrsByDID = _.object(_.map(datasets, (e) -> [e.dID, e.column_attrs]))

      console.log("Got datasets in builder:", $scope.datasets, $scope.columnAttrsByDID)
    )
   
    # TODO Find a better way to resolve data dependencies without just making everything synchronous
    PropertyService.getProperties({ pID: $scope.pID }, (properties) ->
      $scope.properties = properties
      $scope.overlaps = properties.overlaps
      $scope.hierarchies = properties.hierarchies
      console.log("Got properties in builder:", $scope.properties)
        # $scope.selectedVectorY = { name: _initialSpec.groupBy }
        # $scope.selectedVectorX = 'share'
    )
  )
)