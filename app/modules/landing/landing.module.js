angular = require('angular');

angular.module('diveApp.landing', ['diveApp.services', 'ui.router']);

require('./project_list.ctrl');
require('./create_project.ctrl');
require('./landing_tabs.ctrl');
require('./authenticate.ctrl');

angular.module('diveApp.landing').directive('landingTop', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/landing/landing_top_bar.html',
  };
});

angular.module('diveApp.landing').directive('landingNavBar', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/landing/landing_nav_bar.html',
    controller: 'LandingTabsCtrl'
  };
});