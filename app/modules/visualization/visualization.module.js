var angular = require('angular')

angular.module('diveApp.visualization', ['diveApp.services']);

angular.module('diveApp.visualization').directive('visualizationNavBar', function() {
  return {
    restrict: 'E',
    templateUrl: 'modules/visualization/partials/visualization_nav_bar.html',
    controller: 'VisualizationNavBarCtrl'
  };
});

require('./visualization.ctrl');
require('./visualization_preview.directive');
require('./histogram.directive');