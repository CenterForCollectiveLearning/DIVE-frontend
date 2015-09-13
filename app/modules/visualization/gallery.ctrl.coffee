angular.module('diveApp.visualization').controller('GalleryCtrl', ($scope, $rootScope, DataService, PropertiesService, SpecsService, pIDRetrieved) ->
  @visualizationsCtrl = $scope.$parent.visualizationsCtrl
)
