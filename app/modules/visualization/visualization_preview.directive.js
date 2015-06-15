require('jquery');
require('d3');
require('d3plus');
require('topojson');
require('metrics-graphics')

angular.module('diveApp.visualization').directive("visualizationPreview", [
  "$window", "$timeout", function($window, $timeout) {
    return {
      restrict: "EA",
      scope: {
        vizSpec: "=",
        vizData: "=",
        vizType: "=",
        conditional: "=",
        selectedValues: "=",
        label: "@",
        onClick: "&"
      },
      link: function(scope, ele, attrs) {

        // TODO fix the resize function
        $window.onresize = function() { 
          scope.$apply(); 
        };

        scope.$watch((function() {
          angular.element($window)[0].innerWidth;
        }), function() {
          scope.render(scope.vizSpec, scope.vizType, scope.vizData, scope.conditional, scope.selectedValues);
        });

        // TODO Find a more versatile way to watch object value changes
        scope.$watch('selectedValues', (function(selectedValues) {
          scope.render(scope.vizSpec, scope.vizType, scope.vizData, scope.conditional, selectedValues);
        }), true);

        scope.$watchCollection("[vizSpec, vizType, vizData, conditional, selectedValues]", (function(newData) {
          scope.render(newData[0], newData[1], newData[2], newData[3], newData[4]);
        }), true);

        scope.render = function(vizSpec, vizType, vizData, conditional, selectedValues) {
          if (!(vizSpec && vizType && vizData && conditional && selectedValues)) { return; }
          if (renderTimeout) { clearTimeout(renderTimeout); }

          var renderTimeout = $timeout(function() {
            var agg, d3PlusTypeMapping, dropdown, viz, x, y;

            var category = vizSpec.category;

            var vizContainer = $(".visualization .left-side");
            var displayParameters = {
              width: vizContainer.width(),
              height: vizContainer.height()
            }

            console.info("Rendering visualization with vizData:", vizData);
            console.info("Rendering visualization with parameters:", displayParameters);

            ////////////////////
            // CATEGORY: Time Series
            ////////////////////
            if (category === 'time series') {

              // Remove d3plus visualization if it exists
              $("div#viz-container svg#d3plus").remove();

              var legend = [];
              var timeSeriesMatrix = [];

              _.each(vizData, function(v, k) {
                if (v.length > 0 && selectedValues[k]) {
                  if (v[0].date instanceof Date) {
                    var data = v;
                  } else {

                    // Get date selector
                    // TODO Either get this from the user or infer more intelligently (on backend?)
                    if (v[0].date.indexOf('-') > -1) {
                      var dateSelector = '%Y-%b';                  
                    } else {
                      var dateSelector = '%Y';                  
                    }

                    try {
                      var data = MG.convert.date(v, 'date', dateSelector);
                    } catch (e) {
                      var data = v;
                    }
                  }

                  legend.push(k);
                  timeSeriesMatrix.push(data);   
                }
              });

              var show_missing_background = false;
              if (timeSeriesMatrix.length === 0) {
                MG.data_graphic({
                  target: '#viz-container',
                  chart_type: 'missing-data',
                  missing_text: 'No data available',
                  right: 10,
                  width: displayParameters.width,
                  height: displayParameters.height
                });
              } else {
                MG.data_graphic({
                  data: timeSeriesMatrix,
                  target: '#viz-container',
                  show_missing_background: show_missing_background,
                  x_accessor: 'date',
                  y_accessor: 'value',
                  xax_count: 12,
                  y_extended_ticks: true,
                  aggregate_rollover: true,
                  // missing_is_hidden: true,
                  interpolate_tension: 0.9,
                  show_rollover_text: true,
                  max_data_size: 10,
                  legend: legend,
                  legend_target: '.legend',
                  right: 10,
                  width: displayParameters.width,
                  height: displayParameters.height - 40
                })
              }
            } 

            ////////////////////
            // CATEGORY: Comparison
            ////////////////////
            if (category === 'comparison') {
              console.log("Passing compare into visualization, data:", vizData);
            } 

            ///////////////////////
            // Passing into D3Plus
            ///////////////////////
            var d3PlusCategories = ['shares']
            if (d3PlusCategories.indexOf(category) > -1) {
              var d3PlusTypeMapping = {
                shares: 'tree_map',
                piechart: 'pie',
                barchart: 'bar',
                scatterplot: 'scatter',
                linechart: 'line',
                geomap: 'geo_map'
              };

              console.log("Passing data into d3Plus:", vizData);
              var viz = d3plus.viz()
                .type(vizType)
                .container("#viz-container")
                .margin("8px")
                .width(displayParameters.width)
                .height(displayParameters.height)
                .font({ family: "Titillium Web" });
            }

            if (category === 'shares') {
              viz.id(vizSpec.group.by.title.toString())
              .size("value")
              .data(vizData)
              .draw();
            } 

            if (category === 'distribution') {
              var sortedVizData = _.sortBy(vizData, function(e) { return e.value; });
              var groupBy = vizSpec.group.by.title.toString();

              $("div#viz-container svg#d3plus").remove();

              MG.data_graphic({
                data: sortedVizData,
                chart_type: 'bar',
                width: displayParameters.width,
                height: displayParameters.height,
                bar_orientation: 'vertical',
                target: '#viz-container',
                x_accessor: groupBy,
                y_accessor: 'value',
                baseline_accessor: null,
                predictor_accessor: null
              });
            }

            // if (category === 'distribution') {
            //   var groupBy = vizSpec.group.by.title.toString();
            //   var sortedVizData = _.sortBy(vizData, function(e) { return e.value; });

            //   console.log("Creating distribution visualization of type", vizType, groupBy);
            //   viz.id(groupBy)  // .id(groupBy)
            //   .id({ grouping: false })
            //   .x(groupBy)
            //   .y("value")
            //   .data(sortedVizData)
            //   .draw();
            // } 

            // if (vizType === "scatterplot" || vizType === "barchart" || vizType === "linechart") {

            //   var x = vizSpec.x.title;
            //   var agg = vizSpec.aggregation;
            //   if (agg) {
            //     viz.x(x).y("count");
            //     if (vizSpec.x.type === "datetime") {
            //       viz.x(function(d) {
            //         return (new Date(d[x])).valueOf();
            //       }).format({
            //         number: function(d, k) {
            //           if (typeof k === "function") {
            //             return d3.time.format("%m/%Y")(new Date(d));
            //           } else {
            //             return d;
            //           }
            //         }
            //       }).y("count");
            //     } else {
            //       viz.x(x).y("count");
            //     }
            //     if (vizType === "linechart") {
            //       return viz.id("id").draw();
            //     } else {
            //       return viz.id(x).size(10).draw();
            //     }
            //   } else {
            //     y = vizSpec.y.title;
            //     return viz.title(getTitle(vizType, vizSpec)).x(x).y(y).id(x).draw();
            //   }
            // } else if (vizType === "geomap") {
            //   console.log("Rendering geomap with id:", vizSpec.group.by.title.toString());
            //   return viz.title(getTitle(vizType, vizSpec)).coords("/assets/misc/countries.json").id("id").text("label").color("count").size("count").draw();
            // }
            /////////////
          }, 200);
        };
      }
    };
  }
]);