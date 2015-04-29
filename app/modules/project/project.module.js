require('angular');

angular.module('diveApp.project', ['diveApp.services', 'ui.router']);

require('./project_top_bar.ctrl');
require('./project_overview.ctrl');
require('./project_pane_toggle.ctrl');
require('./project_tabs.ctrl');

angular.module('diveApp.project').directive('loader', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/project/loader.html'
  };
});

angular.module('diveApp.project').directive('projectTopBar', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/project/project_top_bar.html',
    controller: 'ProjectTopBarCtrl'
  };
});

angular.module('diveApp.project').directive('projectNavBar', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/project/project_nav_bar.html',
    controller: 'ProjectTabsCtrl'
  };
});

angular.module('diveApp.project').directive('paneToggle', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/project/project_pane_toggle.html',
    controller: 'PaneToggleCtrl'
  };
});