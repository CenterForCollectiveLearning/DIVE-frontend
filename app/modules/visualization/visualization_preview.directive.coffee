$ = require('jquery')
d3 = require('d3')
d3plus = require('d3plus')
topojson = require('topojson')

angular.module('diveApp.visualization').directive "visualizationPreview", ["$window", "$timeout",
  ($window, $timeout) ->
    return (
      restrict: "EA"
      scope:
        vizType: "="
        vizSpec: "="
        vizData: "="
        conditional: "="
        label: "@"
        onClick: "&"

      link: (scope, ele, attrs) ->
        renderTimeout = undefined
        $window.onresize = ->
          scope.$apply() 
        # Resizing
        scope.$watch ( ->
          angular.element($window)[0].innerWidth
        ), ->
          scope.render(scope.vizType, scope.vizSpec, scope.vizData, scope.conditionalData)
        scope.$watchCollection("[vizType,vizSpec,vizData,conditional]", ((newData) ->
          scope.render(newData[0], newData[1], newData[2], newData[3])
        ), true)
        scope.render = (vizType, vizSpec, vizData, conditional) ->
          unless (vizData and vizSpec and vizType and conditional)
            return
          clearTimeout renderTimeout if renderTimeout
          renderTimeout = $timeout(->
            getTitle = (vizType, vizSpec, conditional) ->
              title = ''
              if vizType in ['treemap', 'piechart']
                title += ('Group all ' + vizSpec.aggregate.title + ' by ' + vizSpec.groupBy.title.toString())
                if (vizSpec.condition.title)
                  title += (' given a ' + vizSpec.condition.title.toString())
              else if vizType in ['scatterplot', 'barchart', 'linechart']
                return
              return title
            if condition
              condition = vizSpec.condition.title.toString()
              if conditionalData.length < 300
                dropdown = d3plus.form()
                  .container("div#viz-container")
                  .data(conditionalData)
                  .title("Select Options")
                  .id(condition)
                  .text(condition)
                  .type("drop")
                  .title(condition)
                  .draw()
            d3PlusTypeMapping =
              treemap: 'tree_map'
              piechart: 'pie'
              barchart: 'bar'
              scatterplot: 'scatter'
              linechart: 'line'
              geomap: 'geo_map'

            viz = d3plus.viz()
              .type(d3PlusTypeMapping[vizType])
              .container("div#viz-container")
              .width($("section.viewport").width() - 40)
              .margin("20px")
              .height(600)
              .data(vizData)
              .font(family: "Titillium Web")

            if vizType in ["treemap", "piechart"]
              viz.title(getTitle(vizType, vizSpec))
                .id(vizSpec.groupBy.title.toString())
                .size("count")
                .draw()

            else if vizType in ["scatterplot", "barchart", "linechart"]
              x = vizSpec.x.title
              agg = vizSpec.aggregation
              # console.log(vizType, d3PlusTypeMapping[vizType])
              # console.log("viz data", vizData)
              if agg
                sample_data = [
                  {"year": 1991, "name":"alpha", "value": 17},
                  {"year": 1992, "name":"alpha", "value": 20},
                  {"year": 1993, "name":"alpha", "value": 25},
                  {"year": 1994, "name":"alpha", "value": 33},
                  {"year": 1995, "name":"alpha", "value": 52},
                  {"year": 1991, "name":"beta", "value": 36},
                  {"year": 1992, "name":"beta", "value": 32},
                  {"year": 1993, "name":"beta", "value": 40},
                  {"year": 1994, "name":"beta", "value": 58},
                  {"year": 1995, "name":"beta", "value": 13},
                  {"year": 1991, "name":"gamma", "value": 24},
                  {"year": 1992, "name":"gamma", "value": 27},
                  {"year": 1994, "name":"gamma", "value": 35},
                  {"year": 1995, "name":"gamma", "value": 40}
                ]
                # viz.data(sample_data)
                #   .title(getTitle(vizType, vizSpec))
                #   .type(d3PlusTypeMapping[vizType])
                #   .id("name")
                #   .x("year")
                #   .y("value")
                #   .draw()
                console.log(x)
                viz.title(getTitle(vizType, vizSpec))
                  .type(d3PlusTypeMapping[vizType])
                  # .color("#000000")
                  .x(x)
                  .y("count")


                  if vizType is "linechart"
                    viz.id("id")
                    .draw()
                  else
                    viz.id(x)
                    .size(10)
                    .draw()
              else
                y = vizSpec.y.title
                viz.title(getTitle(vizType, vizSpec))
                  .x(x)
                  .y(y)
                  .id(x)
                  .draw()
            else if vizType in ["geomap"]
              console.log("Rendering geomap with id:", vizSpec.groupBy.title.toString())
              viz.title(getTitle(vizType, vizSpec))
                .coords("/assets/misc/countries.json")
                .id("id")  # vizSpec.groupBy.title.toString())  # Needs to match ID in country json
                .text("label")
                .color("count")
                .size("count")
                .draw()
          , 200)
    )
]