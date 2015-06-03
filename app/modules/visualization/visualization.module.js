var angular = require('angular')

angular.module('diveApp.visualization', ['diveApp.services']);

angular.module('diveApp.visualization').directive('visualizationSideNav', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/visualization/partials/side_nav.html',
    controller: 'VisualizationSideNavCtrl'
  };
});

angular.module('diveApp.visualization').directive('visualizationConditionals', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/visualization/partials/conditionals.html',
    controller: 'VisualizationConditionalsCtrl'
  };
});

angular.module('diveApp.visualization').directive('visualizationStats', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/visualization/partials/stats.html',
    controller: 'VisualizationStatsCtrl'
  };
});

angular.module('diveApp.visualization').directive('visualizationExport', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/visualization/partials/export.html',
    controller: 'VisualizationExportCtrl'
  };
});

angular.module('diveApp.visualization').directive('visualizationGrouping', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/visualization/partials/grouping.html',
    controller: 'VisualizationGroupingCtrl'
  };
});

require('./visualization.ctrl');
require('./visualization_preview.directive');
require('./histogram.directive');
require('./scatterplot.directive');