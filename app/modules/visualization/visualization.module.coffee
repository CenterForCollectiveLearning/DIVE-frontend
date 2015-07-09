angular = require('angular')
angular.module('diveApp.visualization', [ 'diveApp.services' ])

angular.module('diveApp.visualization').directive('visualizationSideNav', ->
  {
    restrict: 'E'
    templateUrl: 'modules/visualization/partials/side_nav.html'
    controller: 'VisualizationSideNavCtrl'
  }
)

angular.module('diveApp.visualization').directive('visualizationConditionals', ->
  {
    restrict: 'E'
    templateUrl: 'modules/visualization/partials/conditionals.html'
    controller: 'VisualizationConditionalsCtrl'
  }
)

angular.module('diveApp.visualization').directive('visualizationStats', ->
  {
    restrict: 'E'
    templateUrl: 'modules/visualization/partials/stats.html'
    controller: 'VisualizationStatsCtrl'
  }
)

angular.module('diveApp.visualization').directive('visualizationExport', ->
  {
    restrict: 'E'
    templateUrl: 'modules/visualization/partials/export.html'
    controller: 'VisualizationExportCtrl'
  }
)

require('./visualization.ctrl')
require('./builder.ctrl')
require('./grid.ctrl')
require('./recommended.ctrl')

require('./visualization_preview.directive')
require('./histogram.directive')
require('./scatterplot.directive')
require('../base/table.directive')
