angular = require('angular')

# Top-level
require('./routes')
require('./data_service')

# Modules
require('../modules/landing/landing.module')
require('../modules/project/project.module')
require('../modules/data/data.module')
require('../modules/property/property.module')
require('../modules/visualization/visualization.module')
require('../modules/export/export.module')

diveApp = angular.module('diveApp', ['diveApp.routes', 'diveApp.project', 'diveApp.landing', 'diveApp.data', 'diveApp.property', 'diveApp.visualization', 'diveApp.export'])

# TODO Change API endpoint as a function of configuration
diveApp.constant('API')

# Utility Functions
window.SC = (selector) -> angular.element(selector).scope()

window.objectToQueryString = (obj) ->
    str = []
    for p of obj
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]))
    str.join("&")

window.formatRouteParam = (str) ->
    str.trim().replace(/"/g, "")

window.onresize = (e) ->
    mainViewHeight = $(window).height() - $("header").height()
    $("div.wrapper").height mainViewHeight

$ = require('jquery')

# Need to return function
diveApp.filter "capitalize", -> 
  (input, scope) ->
    input = input.toLowerCase()
    input.substring(0, 1).toUpperCase() + input.substring(1)

# Resizing viewport for no overflow
angular.element(document).ready ->
  mainViewHeight = $(window).height() - $("header").height()                             
  $("div.wrapper").height mainViewHeight
