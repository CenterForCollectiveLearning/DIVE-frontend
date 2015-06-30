var _ = require('underscore');

angular.module('diveApp.landing').controller('LandingTabsCtrl', function($scope, $state, $rootScope, $stateParams) {
  var setTabs = function () {
    $scope.tabs = [
      {
        state: 'landing.create',
        label: 'Create'
      }, {
        state: 'landing.projects',
        label: 'Projects'
      }, {
        state: 'landing.reports',
        label: 'Reports'
      }, {
        state: 'landing.about',
        label: 'About'
      }
    ];
  }

  setTabs();

  var currentStateSplit = $state.current.name.split('.');
  var currentState = currentStateSplit[0] + '.' + currentStateSplit[1];
  $scope.selectedIndex = _.findIndex($scope.tabs, { state: currentState });
  $scope.$watch('selectedIndex', function(current, old) {
    if (current >= 0 && old >= 1 && current != old) {
      console.log("current: " + current + " old: " + old);
      $state.go($scope.tabs[current].state);      
    }
  });
});
