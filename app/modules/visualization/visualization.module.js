var angular = require('angular')

angular.module('diveApp.visualization', ['diveApp.services']);

require('./visualization.ctrl');
require('./visualization_preview.directive');
require('./histogram.directive');