angular = require('angular');

angular.module('diveApp.landing', ['diveApp.services', 'ui.router']);

require('./project_list.ctrl');
require('./create_project.ctrl');
require('./landing_tabs.ctrl');
require('./authenticate.ctrl');

angular.module('diveApp.landing').directive('navBar', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/landing/navbar.html',
    controller: 'LandingTabsCtrl'
  };
});
