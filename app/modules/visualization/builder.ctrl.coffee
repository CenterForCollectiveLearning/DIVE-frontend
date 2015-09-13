angular.module('diveApp.visualization').controller('BuilderCtrl', ($scope, $rootScope, $stateParams, DataService, PropertiesService, SpecsService, pIDRetrieved) ->
  @visualizationsCtrl = $scope.$parent.visualizationsCtrl
  @visualizationsCtrl.selectedSpecID = $stateParams.sID
  if @visualizationsCtrl.specs
    @visualizationsCtrl.showVisualization()
)
