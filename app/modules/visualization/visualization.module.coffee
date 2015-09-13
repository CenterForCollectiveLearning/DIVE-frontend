angular = require('angular')
angular.module('diveApp.visualization', [ 'diveApp.services' ])

require('./visualizations.ctrl')
require('./builder.ctrl')
require('./gallery.ctrl')
require('./visualization.ctrl')

require('./visualizationplot.directive')
require('../base/datatable.directive')
