require('jquery')
require('d3')
require('d3plus')
require('topojson')
require('metrics-graphics')

angular.module('diveApp.visualization').directive('visualizationPreview', ['$window', '$timeout', ($window, $timeout) ->
    {
      restrict: 'EA'
      scope:
        vizSpec: '='
        vizData: '='
        vizType: '='
        conditional: '='
        selectedValues: '='
        label: '@'
        onClick: '&'
      link: (scope, ele, attrs) ->
        # TODO fix the resize function

        $window.onresize = ->
          scope.$apply()
          return

        scope.$watch (->
          angular.element($window)[0].innerWidth
          return
        ), ->
          scope.render scope.vizSpec, scope.vizType, scope.vizData, scope.conditional, scope.selectedValues
          return
        # TODO Find a more versatile way to watch object value changes
        scope.$watch 'selectedValues', ((selectedValues) ->
          scope.render scope.vizSpec, scope.vizType, scope.vizData, scope.conditional, selectedValues
          return
        ), true
        scope.$watchCollection '[vizSpec, vizType, vizData, conditional, selectedValues]', ((newData) ->
          scope.render newData[0], newData[1], newData[2], newData[3], newData[4]
          return
        ), true

        scope.render = (vizSpec, vizType, vizData, conditional, selectedValues) ->
          if !(vizSpec and vizType and vizData and conditional and selectedValues)
            return

          category = vizSpec.category
          vizContainer = $('.visualization .left-side')
          displayParameters = 
            width: vizContainer.width() + 1
            height: vizContainer.height()

          console.info 'Rendering visualization with vizData:', vizData
          console.info 'Rendering visualization with parameters:', displayParameters
          #//////////////////
          # CATEGORY: Time Series
          #//////////////////
          if category == 'time series'
            # Remove d3plus visualization if it exists
            $('div#viz-container svg#d3plus').remove()
            legend = []
            timeSeriesMatrix = []
            _.each vizData, (v, k) ->
              `var viz`
              `var d3PlusTypeMapping`
              `var data`
              `var data`
              `var dateSelector`
              if v.length > 0 and selectedValues[k]
                if v[0].date instanceof Date
                  data = v
                else
                  # Get date selector
                  # TODO Either get this from the user or infer more intelligently (on backend?)
                  if v[0].date.indexOf('-') > -1
                    dateSelector = '%Y-%b'
                  else
                    dateSelector = '%Y'
                  try
                    data = MG.convert.date(v, 'date', dateSelector)
                  catch e
                    data = v
                legend.push k
                timeSeriesMatrix.push data
              return
            show_missing_background = false
            if timeSeriesMatrix.length == 0
              MG.data_graphic
                target: '#viz-container'
                chart_type: 'missing-data'
                missing_text: 'No data available'
                right: 10
                width: displayParameters.width
                height: displayParameters.height
            else
              MG.data_graphic
                data: timeSeriesMatrix
                target: '#viz-container'
                show_missing_background: show_missing_background
                x_accessor: 'date'
                y_accessor: 'value'
                xax_count: 12
                y_extended_ticks: true
                aggregate_rollover: true
                interpolate_tension: 0.9
                show_rollover_text: true
                max_data_size: 10
                legend: legend
                legend_target: '.legend'
                right: 10
                width: displayParameters.width
                height: displayParameters.height - 40
          #//////////////////
          # CATEGORY: Comparison
          #//////////////////
          if category == 'comparison'
            console.log 'Passing compare into visualization, data:', vizData
          #/////////////////////
          # Passing into D3Plus
          #/////////////////////
          d3PlusCategories = [ 'shares' ]
          if d3PlusCategories.indexOf(category) > -1
            d3PlusTypeMapping = 
              shares: 'tree_map'
              piechart: 'pie'
              barchart: 'bar'
              scatterplot: 'scatter'
              linechart: 'line'
              geomap: 'geo_map'
            console.log 'Passing data into d3Plus:', vizData
            viz = d3plus.viz().type(vizType).container('#viz-container').width(displayParameters.width).height(displayParameters.height)
          if category == 'shares'
            viz.id(vizSpec.group.by.title.toString()).size('value').data(vizData).draw()
          if category == 'distribution'
            sortedVizData = _.sortBy(vizData, (e) ->
              e.value
            )
            groupBy = vizSpec.group.by.title.toString()
            $('div#viz-container svg#d3plus').remove()
            MG.data_graphic
              data: sortedVizData
              chart_type: 'bar'
              width: displayParameters.width
              height: displayParameters.height
              bar_orientation: 'vertical'
              target: '#viz-container'
              x_accessor: groupBy
              y_accessor: 'value'
              baseline_accessor: null
              predictor_accessor: null

    }
  ]
)
