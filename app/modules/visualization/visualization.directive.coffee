require('jquery')
require('d3')
require('d3plus')
require('topojson')
require('metrics-graphics')

angular.module('diveApp.visualization').directive('visualization', ['$window', ($window) ->
  {
    restrict: 'EA'
    scope:
      spec: '='
      type: '='
      data: '='

    link: (scope, element, attrs) ->

      scope.$watchCollection '[spec, data]', ((newData) ->
        scope.render newData[0], newData[1]
        return
      ), true

      scope.render = (spec, data) ->
        return unless spec and data

        type = "tree_map"
        container = $('.visualization .left-side')

        displayParams =
          width: container.width() + 1
          height: container.height()

        field_b = spec.arguments.field_b
        data = data[field_b]

        console.info 'id', spec.field_a
        console.info 'Rendering visualization with data:', data
        console.info 'Rendering visualization with parameters:', displayParams

        visualization = d3plus.viz()
          .type(type)
          .container('#viz-container')
          .width(displayParams.width)
          .height(displayParams.height)
          .id(spec.field_a)
          .size(field_b)
          .data(data)
          .draw()

  }
])
