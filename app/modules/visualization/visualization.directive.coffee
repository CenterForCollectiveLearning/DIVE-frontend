require('jquery')
require('d3')
require('d3plus')
require('topojson')
require('metrics-graphics')

angular.module('diveApp.visualization').directive('visualization', ['$window', ($window) ->
  {
    restrict: 'EA'
    scope:
      type: '='
      spec: '='
      data: '='

    link: (scope, element, attrs) ->

      scope.$watchCollection '[type, spec, data]', ((newData) ->
        scope.render newData[0], newData[1], newData[2]
        return
      ), true

      scope.render = (type, spec, data) ->
        return unless type and spec and data

        COUNT_ATTRIBUTE = "count"
        container = $('.visualization .left-side')

        displayParams =
          width: container.width() + 1
          height: container.height()

        field_b = spec.arguments.field_b

        if not field_b
          field_b = COUNT_ATTRIBUTE

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

        switch type
          when 'tree_map', 'pie'
            visualization.size(field_b)
          when 'bar'
            visualization.x({value: spec.field_a, grid: false})
            visualization.y(field_b)
          when 'line'
            visualization.x({value: spec.field_a, grid: false})
            visualization.y(field_b)

        visualization.data(data)
          .draw()

  }
])
