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
      minimal: '='
      selector: '@selector'

    link: (scope, element, attrs) ->

      scope.$watchCollection '[type, spec, data, minimal, selector]', ((newData) ->
        scope.render newData[0], newData[1], newData[2], newData[3], newData[4]
        return
      ), true

      attrs.$observe('selector', (actual_value) ->
        actual_value = actual_value.replace(/["]/g, '')
        element.val('selector=' + actual_value)
        scope.selector = actual_value
      )

      scope.render = (type, spec, data, minimal, selector) ->
        console.log "Render requirements: #{type?} #{spec?} #{data?} #{minimal?} #{selector?}"
        return unless type and spec and data and selector

        console.info 'Spec', spec
        console.info 'Selector', selector
        console.info 'Generating Procedure', spec.generatingProcedure
        console.info 'Rendering visualization with data:', data

        generatingProcedure = spec.generatingProcedure

        d3.select(selector + " > *").remove()  # Reset SVG

        switch type
          when 'tree', 'pie'
            if generatingProcedure = "val:count"
              itemAccessor = 'value'
              valueAccessor = 'count'
              itemAccessor = spec.args.fieldA
            if generatingProcedure = "val:agg"
              itemAccessor = 'value'
              valueAccessor = 'agg'
              itemAccessor = spec.args.groupedField

            scale = new Plottable.Scales.Linear()
            colorScale = new Plottable.Scales.InterpolatedColor()
            colorScale.range(["#BDCEF0", "#5279C7"])

            # TODO Restructure output to fit [{ val: 1 }, { val: 2 }, { val: 3 },
            # { val: 4 }, { val: 5 }, { val: 6 }];
            # plot = new Plottable.Plots.Pie()
            #
            # plot.addDataset(dataset)
            #   .sectorValue((d -> d[itemAccesor]), scale)
            #   .attr('fill', (d -> d[field_b]), colorScale)
            #   .renderTo(selector)

          when 'bar', 'hist'
            if generatingProcedure == 'val:count'
              xAccessor = 'value'
              yAccessor = 'count'
              xLabel = spec.args.fieldA.label
              yLabel = 'count'
            if generatingProcedure == 'bin:agg'
              xAccessor = 'bin'
              yAccessor = 'value'
              xLabel = spec.args.binningField.label
              yLabel = spec.args.aggFieldA.label
            if generatingProcedure == 'val:val'
              xAccessor = 'x'
              yAccessor = 'y'
              xLabel = spec.args.fieldA.label
              yLabel = spec.args.fieldB.label
            if generatingProcedure == 'val:agg'
              xAccessor = 'value'
              yAccessor = 'agg'
              xLabel = spec.args.groupedField.label
              yLabel = spec.args.aggField.label

            plot = new Plottable.Plots.Bar()

            xDomain = _.pluck(data, xAccessor)
            xScale = new Plottable.Scales.Category().domain(xDomain)
            yScale = new Plottable.Scales.Linear()

            xAxis = new Plottable.Axes.Category(xScale, "bottom")
            yAxis = new Plottable.Axes.Numeric(yScale, "left")

            xLabel = new Plottable.Components.AxisLabel(xLabel)
            yLabel = new Plottable.Components.AxisLabel(yLabel, -90)

            dataset = new Plottable.Dataset(data)

            console.log("About to plot!")

            plot.addDataset(dataset)
              .x(((d) -> d[xAccessor]), xScale)
              .y(((d) -> d[yAccessor]), yScale)
              .animated(true)

            if minimal
              plot.animated(false)
              plot.renderTo(selector)
            else
              plot.animated(true)
              chart = new Plottable.Components.Table([
                [yLabel, yAxis, plot],
                [null, null, xAxis],
                [null, null, xLabel]
              ])
              chart.renderTo(selector)

          when 'scatter'
            if spec.generatingProcedure == 'val:val'
              xAccessor = 'x'
              yAccessor = 'y'
              xLabel = spec.args.fieldA.label
              yLabel = spec.args.fieldB.label
            if spec.generatingProcedure == 'agg:agg'
              xAccessor = 'x'
              yAccessor = 'y'
              xLabel = spec.args.aggFieldA.label
              yLabel = spec.args.aggFieldB.label

              plot = new Plottable.Plots.Scatter()

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

              if minimal
                plot.animated(false)
                plot.renderTo(selector)
              else
                plot.animated(true)
                chart = new Plottable.Components.Table([
                  [yLabel, yAxis, plot],
                  [null, null, xAxis],
                  [null, null, xLabel]
                ])
                chart.renderTo(selector)
          when 'line'
            if spec.generatingProcedure == 'ind:val'
              xAccessor = 'index'
              yAccessor = 'value'
              xLabel = 'index'
              yLabel = spec.args.fieldA.label

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

            if minimal
              plot.animated(false)
              plot.renderTo(selector)
            else
              plot.animated(true)
              chart = new Plottable.Components.Table([
                [yLabel, yAxis, plot],
                [null, null, xAxis],
                [null, null, xLabel]
              ])
              chart.renderTo(selector)

          when 'network'
            # if generatingProcedure = 'val:val'
            #   nodeLabelA = spec.args.fieldA.label
            #   nodeLabelB = spec.args.fieldB.label
            # d3plus.viz()
            #   .container("#viz")
            #   .type("network")
            #   .data(data)
            #   .edges(data)
            #   .draw()
            return

          when 'multiline'
            return
        if plot
          $window.addEventListener('resize', -> plot.redraw())
  }
])
