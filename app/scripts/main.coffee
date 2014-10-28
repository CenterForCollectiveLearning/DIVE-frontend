# angular = require('angular')
# d3 = require('d3')
# # d3Plus = require('d3plus')
# routes = require('./routes')

# landingPage = require('../modules/landing/landing.module')
# projectPage = require('../modules/project/project.module')
# dataPage = require('../modules/data/data.module')
# propertyPage = require('../modules/property/property.module')
# visualizationPage = require('../modules/visualization/visualization.module')
# exportPage = require('../modules/export/export.module')

diveApp = angular.module('diveApp', ['diveApp.routes', 'diveApp.project', 'diveApp.landing', 'diveApp.data', 'diveApp.property', 'diveApp.visualization', 'diveApp.export'])

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

# Need to return function
diveApp.filter "capitalize", -> 
  (input, scope) ->
    input = input.toLowerCase()
    input.substring(0, 1).toUpperCase() + input.substring(1)

# Resizing viewport for no overflow
angular.element(document).ready ->
  mainViewHeight = $(window).height() - $("header").height()                             
  $("div.wrapper").height mainViewHeight
