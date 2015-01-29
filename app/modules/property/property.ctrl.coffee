angular.module('diveApp.property').controller "OntologyEditorCtrl", ($scope, $http, DataService, PropertyService) ->
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
  )

  $scope.loading = true

  PropertyService.getProperties((properties) ->
    $scope.loading = false
    $scope.properties = properties
    $scope.overlaps = properties.overlaps
    $scope.hierarchies = properties.hierarchies
    $scope.uniques = properties.uniques
    $scope.stats = properties.stats
  )