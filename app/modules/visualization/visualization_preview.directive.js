var $, d3, d3plus, topojson;

$ = require('jquery');

d3 = require('d3');

d3plus = require('d3plus');

topojson = require('topojson');

require('metrics-graphics')

angular.module('diveApp.visualization').directive("visualizationPreview", [
  "$window", "$timeout", function($window, $timeout) {
    return {
      restrict: "EA",
      scope: {
        vizSpec: "=",
        vizData: "=",
        conditional: "=",
        selectedValues: "=",
        label: "@",
        onClick: "&"
      },
      link: function(scope, ele, attrs) {
        var renderTimeout;
  
        $window.onresize = function() { 
          console.log("Window resizing");
          scope.$apply(); 
        };

        scope.$watch((function() {
          angular.element($window)[0].innerWidth;
        }), function() {
          scope.render(scope.vizSpec, scope.vizData, scope.conditional, scope.selectedValues);
        });

        // TODO Find a more versatile way to watch object value changes
        scope.$watch('selectedValues', (function(selectedValues) {
          scope.render(scope.vizSpec, scope.vizData, scope.conditional, selectedValues);
        }), true);

        scope.$watchCollection("[vizSpec,vizData,conditional,selectedValues]", (function(newData) {
          scope.render(newData[0], newData[1], newData[2], newData[3]);
        }), true);

        scope.render = function(vizSpec, vizData, conditional, selectedValues) {
          if (!(vizSpec && vizData && conditional && selectedValues)) { return; }
          if (renderTimeout) { clearTimeout(renderTimeout); }

          return renderTimeout = $timeout(function() {
            var agg, condition, d3PlusTypeMapping, dropdown, getTitle, viz, x, y;

            var vizType = vizSpec.viz_type;

            getTitle = function(vizType, vizSpec, conditional) {
              var title;
              title = '';
              if (vizType === 'shares') {
                title += 'Group all ' + vizSpec.aggregate.title + ' by ' + vizSpec.groupBy.title.toString();
                if (vizSpec.condition.title) {
                  title += ' given a ' + vizSpec.condition.title.toString();
                }
              } else if (vizType === 'scatterplot' || vizType === 'barchart' || vizType === 'linechart') {
                return;
              }
              return title;
            };
            if (condition) {
              condition = vizSpec.condition.title.toString();
              if (conditionalData.length < 300) {
                dropdown = d3plus.form().container("div#viz-container").data(conditionalData).title("Select Options").id(condition).text(condition).type("drop").title(condition).draw();
              }
            }

            if (vizType === 'time series') {

              // Remove d3plus visualization if it exists
              $("div#viz-container svg#d3plus").remove();

              var legend = [];
              var timeSeriesMatrix = [];
              for (var k in vizData) {
                var v = vizData[k];

                if (v.length > 0) {
                  if (v[0].date.indexOf('-') > -1) {
                    var dateSelector = '%Y-%b';                  
                  } else {
                    var dateSelector = '%Y';                  
                  }

                  if (selectedValues[k]) {
                    // TODO MG.convert.date is mutating arguments, but find a better way to deal
                    try {
                      var data = MG.convert.date(v, 'date', dateSelector);
                    } catch (e) {
                      var data = v;
                    }
                    legend.push(k);
                    timeSeriesMatrix.push(data);                          
                  }              
                }
              }
              var width = $("#viz-container").width();
              var height = $("#viz-container").height();

              var show_missing_background = false;
              if (timeSeriesMatrix.length == 0) {
                MG.data_graphic({
                  target: '#viz-container',
                  chart_type: 'missing-data',
                  missing_text: 'No data available',
                  width: width,
                  height: height
                })
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
                  width: width,
                  height: height
                })
              }
            } else {
              var d3PlusTypeMapping = {
                shares: 'tree_map',
                piechart: 'pie',
                barchart: 'bar',
                scatterplot: 'scatter',
                linechart: 'line',
                geomap: 'geo_map'
              };
              viz = d3plus.viz()
                // .title(getTitle(vizType, vizSpec))
                .type(d3PlusTypeMapping[vizType])
                .container("div#viz-container")
                .width($("#viz-container").width())
                .margin("8px")
                .height($("#viz-container").height())
                .data(vizData)
                .font({
                  family: "Titillium Web"
                });
            }
            
            if (vizType === 'shares') {
              viz.id(vizSpec.groupBy.title.toString())
              .size("value")
              .draw();
            } else if (vizType === "scatterplot" || vizType === "barchart" || vizType === "linechart") {
              x = vizSpec.x.title;
              agg = vizSpec.aggregation;
              if (agg) {
                viz.x(x).y("count");
                if (vizSpec.x.type === "datetime") {
                  viz.x(function(d) {
                    return (new Date(d[x])).valueOf();
                  }).format({
                    number: function(d, k) {
                      if (typeof k === "function") {
                        return d3.time.format("%m/%Y")(new Date(d));
                      } else {
                        return d;
                      }
                    }
                  }).y("count");
                } else {
                  viz.x(x).y("count");
                }
                if (vizType === "linechart") {
                  return viz.id("id").draw();
                } else {
                  return viz.id(x).size(10).draw();
                }
              } else {
                y = vizSpec.y.title;
                return viz.title(getTitle(vizType, vizSpec)).x(x).y(y).id(x).draw();
              }
            } else if (vizType === "geomap") {
              console.log("Rendering geomap with id:", vizSpec.groupBy.title.toString());
              return viz.title(getTitle(vizType, vizSpec)).coords("/assets/misc/countries.json").id("id").text("label").color("count").size("count").draw();
            }
          }, 200);
        };
      }
    };
  }
]);

// ---
// generated by coffee-script 1.9.0