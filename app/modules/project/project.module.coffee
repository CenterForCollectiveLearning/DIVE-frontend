angular = require('angular')

angular.module('diveApp.project', ['diveApp.services', 'ui.router'])

require('./project_overview.ctrl')
require('./pane_toggle.ctrl')
require('./tabs.ctrl')

angular.module('diveApp.project').directive('loader', ->
    restrict: 'E',
    templateUrl: 'modules/project/loader.html'
)

angular.module('diveApp.project').directive('engineTopBar', ->
    restrict: 'E',
    templateUrl: 'modules/project/engine_top_bar.html'
)

angular.module('diveApp.project').directive('paneToggle', ->
    restrict: 'E',
    templateUrl: 'modules/project/engine_pane_toggle.html'
    controller: 'PaneToggleCtrl'
)