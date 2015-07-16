angular = require('angular')
angularTouch = require('angular-touch')
angularCookies = require('angular-cookies')

require 'angular-aria'
require 'angular-animate'
require 'angular-material'
require 'slider'
require './routes'
require './dataService'
require '../modules/landing/landing.module'
require '../modules/project/project.module'
require '../modules/data/data.module'
require '../modules/analysis/analysis.module'
require '../modules/property/property.module'
require '../modules/visualization/visualization.module'
require '../modules/export/export.module'
require '../modules/embed/embed.module'

diveApp = angular.module('diveApp', [
  'ngMaterial'
  'LocalStorageModule'
  'ngAnimate'
  'ngAria'
  'vr.directives.slider'
  'diveApp.routes'
  'diveApp.project'
  'diveApp.landing'
  'diveApp.data'
  'diveApp.property'
  'diveApp.visualization'
  'diveApp.analysis'
  'diveApp.export'
  'diveApp.embed'
]).constant('API_URL', 'http://localhost:8888')

diveApp.config (($mdThemingProvider) ->
  $mdThemingProvider.theme('default').primaryPalette('blue-grey').accentPalette 'light-blue'
  return
), (localStorageServiceProvider) ->
  localStorageServiceProvider.setPrefix('dive').setNotify true, true
  return

window.SC = (selector) ->
  angular.element(selector).scope()

window.objectToQueryString = (obj) ->
  p = undefined
  str = undefined
  str = []
  for p of obj
    `p = p`
    str.push encodeURIComponent(p) + '=' + encodeURIComponent(obj[p])
  str.join '&'

window.formatRouteParam = (str) ->
  str.trim().replace /"/g, ''

window.onresize = (e) ->
  mainViewHeight = undefined
  mainViewHeight = $(window).height() - $('header').height()
  $('div.wrapper').height mainViewHeight

$ = require('jquery')
angular.module('diveApp').directive 'ngEnter', ->
  (scope, element, attrs) ->
    element.bind 'keydown keypress', (event) ->
      if event.which == 13
        scope.$apply ->
          scope.$eval attrs.ngEnter, 'event': event
        return event.preventDefault()
      return
diveApp.filter 'capitalize', ->
  (input, scope) ->
    if input
      input = input.toLowerCase()
      input.substring(0, 1).toUpperCase() + input.substring(1)
    else
      input

String::endsWith = (suffix) ->
  @indexOf(suffix, @length - (suffix.length)) != -1

# TODO Make this more robust
diveApp.filter 'pluralize', ->
  (input, scope) ->
    if input.endsWith('s')
      input
    else
      input + 's'

angular.element(document).ready ->
  mainViewHeight = undefined
  mainViewHeight = $(window).height() - $('header').height()
  $('div.wrapper').height mainViewHeight
