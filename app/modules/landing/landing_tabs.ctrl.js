angular.module('diveApp.landing').controller('LandingTabsCtrl', function($scope, $state, $rootScope, $stateParams) {
  $scope.tabs = [
    {
      route: 'landing.create',
      label: 'Create'
    }, {
      route: 'landing.projects',
      label: 'Projects'
    }, {
      route: 'landing.reports',
      label: 'Reports'
    }, {
      route: 'landing.about',
      label: 'About'
    }
  ];
  $scope.selectedIndex = 0;
  $scope.$watch('selectedIndex', function(current, old) {
    $state.go($scope.tabs[current].route);
  });
});
