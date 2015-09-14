angular.module('diveApp.visualization').controller('VisualizationCtrl', ($scope, $rootScope, $stateParams, DataService, PropertiesService, SpecsService, pIDRetrieved) ->
  @visualizationsCtrl = $scope.$parent.visualizationsCtrl
  $('md-sidenav').hide()
  @visualizationsCtrl.vID = $stateParams.vID
)
