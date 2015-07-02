$ = require('jquery')
require 'underscore'
require 'd3'

angular.module('diveApp.visualization').directive 'histogram', [
  '$window'
  '$timeout'
  ($window, $timeout) ->
    {
      restrict: 'EA'
      scope:
        data: '='
        selector: '='
        title: '='
        label: '='
        selectedValues: '='
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
          scope.render scope.data, scope.selector, scope.title, scope.selectedValues
          return
        scope.$watchCollection '[data, selector, title, selectedValues]', ((newData) ->
          scope.render newData[0], newData[1], newData[2], newData[3]
          return
        ), true
        scope.$watch 'selectedValues', ((selectedValues) ->
          scope.render scope.data, scope.selector, scope.title, selectedValues
          return
        ), true

        scope.render = (data, selector, title, selectedValues) ->
          if !data
            return

          if renderTimeout
            clearTimeout renderTimeout

          return renderTimeout = $timeout((->

            formattedData = []
            for k of data
              v = data[k]
              if selectedValues[k]
                formattedData.push
                  'name': k
                  'value': v

            width = $('div.stats div.content').innerWidth()
            height = Math.max(100, formattedData.length * 30)

            MG.data_graphic
              title: title
              data: formattedData
              baseline_accessor: null
              predictor_accessor: null
              chart_type: 'bar'
              x_accessor: 'value'
              y_accessor: 'name'
              left: 150
              width: width
              height: height
              animate_on_load: true
              target: selector

            return
          ), 200)

        return

    }
]
