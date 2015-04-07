angular = require('angular')

angular.module('diveApp.landing', ['diveApp.services', 'ui.router'])

require('./project_list.ctrl')
require('./create_project_form.ctrl')
require('./landing_tabs.ctrl')

# TODO Refactor top-level directives into another module
angular.module('diveApp.landing').directive('landingTop', ->
    restrict: 'E',
    templateUrl: 'modules/landing/landing_top_bar.html'
    controller: 'ProjectListCtrl'
)

angular.module('diveApp.landing').directive('landingNavBar', ->
    restrict: 'E',
    templateUrl: 'modules/landing/landing_nav_bar.html'
    controller: 'LandingTabsCtrl'
)

angular.module('diveApp.landing').directive('landingProjects', ->
    restrict: 'E',
    templateUrl: 'modules/landing/landing_projects.html',
    controller: 'ProjectListCtrl'
)