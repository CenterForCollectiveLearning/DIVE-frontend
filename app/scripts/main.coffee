angular = require('angular')
angularTouch = require('angular-touch')
angularCookies = require('angular-cookies')
require('slider')

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
require('../modules/embed/embed.module')

diveApp = angular.module('diveApp', ['vr.directives.slider', 'diveApp.routes', 'diveApp.project', 'diveApp.landing', 'diveApp.data', 'diveApp.property', 'diveApp.visualization', 'diveApp.export', 'diveApp.embed'])
  .constant('API_URL', 'http://localhost:8888')

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

angular.module('diveApp').directive 'ngEnter', ->
  (scope, element, attrs) ->
    element.bind 'keydown keypress', (event) ->
      if event.which == 13
        scope.$apply ->
          scope.$eval attrs.ngEnter, 'event': event
        event.preventDefault()

# Need to return function
diveApp.filter "capitalize", -> 
  (input, scope) ->
    if input
      input = input.toLowerCase()
      input.substring(0, 1).toUpperCase() + input.substring(1)
    else
      input

# Resizing viewport for no overflow
angular.element(document).ready ->
  mainViewHeight = $(window).height() - $("header").height()                             
  $("div.wrapper").height mainViewHeight
