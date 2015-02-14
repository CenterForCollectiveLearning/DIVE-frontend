angular = require('angular')

angular.module('diveApp.landing', ['diveApp.services'])

require('./project_list.ctrl')
require('./create_project_form.ctrl')

# TODO Refactor top-level directives into another module
angular.module('diveApp.landing').directive('landingTop', ->
    restrict: 'E',
    templateUrl: 'modules/landing/landing_top.html'
    controller: 'ProjectListCtrl'
)

angular.module('diveApp.landing').directive('landingProjects', ->
    restrict: 'E',
    controller: 'ProjectListCtrl'
    templateUrl: 'modules/landing/landing_projects.html'
)