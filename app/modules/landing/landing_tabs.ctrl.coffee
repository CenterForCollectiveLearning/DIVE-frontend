# Stateful navigation (tabs)
angular.module('diveApp.landing').controller 'LandingTabsCtrl', ($scope, $state, $rootScope, $stateParams) ->
  $scope.tabs = [
    {
      route: 'landing.create'
      label: 'Create'
    }
    {
      route: 'landing.projects'
      label: 'Projects'
    }
    {
      route: 'landing.reports'
      label: 'Reports'
    }
    {
      route: 'landing.about'
      label: 'About'
    }
]