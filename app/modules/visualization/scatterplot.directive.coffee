$ = require('jquery')
require 'underscore'
require 'd3'
angular.module('diveApp.visualization').directive('scatterplot', ['$window', '$timeout', ($window, $timeout) ->
    {
      restrict: 'EA'
      scope:
        data: '='
        entities: '='
        selector: '@'
        onClick: '&'
      link: (scope, ele, attrs) ->
        renderTimeout = undefined

        $window.onresize = ->
          scope.$apply()
          return

        scope.$watch (->
          angular.element($window)[0].innerWidth
          return
        ), ->
          scope.render scope.data, scope.entities, scope.selector
          return
        scope.$watchCollection '[data, entities, selector]', ((newData) ->
          scope.render newData[0], newData[1], newData[2]
          return
        ), true
        scope.$watch 'selectedValues', ((selectedValues) ->
          scope.render scope.data, scope.entities, scope.selector
          return
        ), true
        # Resolving evaluated attribute to actual value
        # http://stackoverflow.com/questions/12371159/how-to-get-evaluated-attributes-inside-a-custom-directive
        attrs.$observe 'selector', (actual_value) ->
          ele.val 'selector=' + actual_value
          scope.selector = actual_value
          return

        scope.render = (data, entities, selector) ->
          console.log 'Rendering scatterplot', data, entities, selector
          if !data
            return
          if renderTimeout
            clearTimeout renderTimeout
          renderTimeout = $timeout((->
            console.log 'Rendering scatterplot', data, entities, selector
            split_entities = entities.split('\t')
            x_name = split_entities[0]
            y_name = split_entities[1]
            #  var formattedData = []
            #  for (var k in data) {
            #    var v = data[k];
            #    if (selectedValues[k]) {
            #      formattedData.push({'name': k, 'value': v});              
            #    }
            #  }
            #  var width = $('div.stats div.content').innerWidth();
            #  var height = Math.max(100, formattedData.length * 30); // $('div.stats div.content').innerHeight();
            title = x_name + ' vs. ' + y_name
            MG.data_graphic
              title: title
              data: data
              chart_type: 'point'
              least_squares: true
              x_accessor: x_name
              y_accessor: y_name
              full_width: true
              height: 300
              animate_on_load: true
              target: selector
          ), 200)
    }
  ]
)
