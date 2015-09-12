require('jquery')
require('d3')
require('d3plus')
require('plottable')

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
        console.log "Render requirements: #{type?} #{spec?} #{data?}"
        return unless type and spec and data

        console.info 'spec', spec
        console.info 'Rendering visualization with data:', data

        generatingProcedure = spec.generatingProcedure

        svgViz = "svg#viz"
        d3.select(svgViz + " > *").remove()  # Reset SVG

        switch type
          when 'tree_map', 'pie'
            console.log("Rendering pie chart")
            scale = new Plottable.Scales.Linear()
            colorScale = new Plottable.Scales.InterpolatedColor()
            colorScale.range(["#BDCEF0", "#5279C7"])

            plot = new Plottable.Plots.Pie()

            plot.addDataset(dataset)
              .sectorValue((d -> d[field_b]), scale)
              .attr('fill', (d -> d[field_b]), colorScale)
              .renderTo(svgViz)

          when 'bar'
            if generatingProcedure == 'val:count'
              xAccessor = 'value'
              yAccessor = 'count'
              xLabel = spec.field_a
              yLabel = 'count'
            if generatingProcedure == 'bin:agg'
              xAccessor = 'bin'
              yAccessor = 'value'
              xLabel = spec.field_a
              yLabel = spec.arguments.function
            if generatingProcedure == 'val:val'
              xAccessor = 'x'
              yAccessor = 'y'
              xLabel = spec.field_a
              yLabel = spec.field_b
            if generatingProcedure == 'val:agg'
              xAccessor = 'value'
              yAccessor = 'agg'
              xLabel = spec.groupedField
              yLabel = spec.aggField

            console.info(xAccessor, yAccessor, xLabel, yLabel)
            plot = new Plottable.Plots.Bar()

            xDomain = _.pluck(data, xAccessor)
            xScale = new Plottable.Scales.Category().domain(xDomain)
            yScale = new Plottable.Scales.Linear()

            xAxis = new Plottable.Axes.Category(xScale, "bottom")
            yAxis = new Plottable.Axes.Numeric(yScale, "left")

            xLabel = new Plottable.Components.AxisLabel(xLabel)
            yLabel = new Plottable.Components.AxisLabel(yLabel, -90)

            dataset = new Plottable.Dataset(data)

            plot.addDataset(dataset)
              .x(((d) -> d[xAccessor]), xScale)
              .y(((d) -> d[yAccessor]), yScale)
              .animated(true)

            chart = new Plottable.Components.Table([
              [yLabel, yAxis, plot],
              [null, null, xAxis],
              [null, null, xLabel]
            ])

            chart.renderTo(svgViz)

          when 'line'
            if spec.generatingProcedure == 'ind:val'
              xAccessor = 'index'
              yAccessor = 'value'
              xLabel = 'index'
              yLabel = spec.field_a

            plot = new Plottable.Plots.Line()

            xScale = new Plottable.Scales.Linear()
            yScale = new Plottable.Scales.Linear()

            xAxis = new Plottable.Axes.Numeric(xScale, "bottom")
            yAxis = new Plottable.Axes.Numeric(yScale, "left")

            xLabel = new Plottable.Components.AxisLabel(xLabel)
            yLabel = new Plottable.Components.AxisLabel(yLabel, -90)

            dataset = new Plottable.Dataset(data)

            plot.addDataset(dataset)
              .x(((d) -> d[xAccessor]), xScale)
              .y(((d) -> d[yAccessor]), yScale)
              .animated(true)

            chart = new Plottable.Components.Table([
              [yLabel, yAxis, plot],
              [null, null, xAxis],
              [null, null, xLabel]
            ])

            chart.renderTo(svgViz)

          when 'network'
            return

          when 'multiline'
            return
        $window.addEventListener('resize', -> plot.redraw())
  }
])
