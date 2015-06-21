require('jquery');
require('d3');
require('d3plus');
require('topojson');
require('metrics-graphics')

angular.module('diveApp.export').directive("assemblePreview", [
  "$window", "$timeout", function($window, $timeout) {
    var renderTimeout;

    return {
      restrict: 'EA',
      scope: {
        vizs: "=",
        vizData: "="
      },
      link: function(scope) {
        $window.onresize = function() {
          scope.$apply();
        };

        scope.$watch('vizData', (function(newVizData) {
          scope.render(scope.vizs, newVizData);
        }), true);

        scope.$watch('vizs', (function(newVizs) {
          scope.render(newVizs, scope.vizData);
        }), true);

        scope.render = function(vizs, vizData) {
          console.log("VIZDATA: ", vizData);
          console.log("VIZS: ", vizs);
          if (!vizData || !vizs) return;
          var numVizs = 0;
          Object.keys(vizs).forEach(function(viz_type) {
            numVizs += vizs[viz_type].length;
          });
          if (numVizs != Object.keys(vizData).length) {
            return;
          }
          if (renderTimeout) { clearTimeout(renderTimeout); }

          return renderTimeout = $timeout(function() {
            console.log("PREVIEW DATA");

            // TODO: should change to only operate on the one taken out or added in
            Object.keys(vizs).map(function(viz_type) {
              vizs[viz_type].map(function(viz) {
                console.log(viz);
                updateViz(viz, vizData[viz.eID]);
              });

            });
          }, 200);
        }

        updateViz = function(vizInfo, vizData) {
          if (!vizInfo.toggled) {
            $("#viz_" + vizInfo.eID).remove();
            return;
          } else {
            if ($("#viz_" + vizInfo.eID).length > 0) return;
          }

          console.log("DRAWING VIZ: ", vizInfo, vizData);

          var vizType = vizInfo.spec.viz_type;
          var vizSpec = vizInfo.spec;

          // WHAT is this ????
          // if (condition) {
          //   condition = vizSpec.condition.title.toString();
          //   if (conditionalData.length < 300) {
          //     dropdown = d3plus.form().container("div#viz-container").data(conditionalData)
          //       .title("Select Options").id(condition).text(condition).type("drop")
          //       .draw();
          //   }
          // }

          $("div.visualization").find("div.left-side")
            .append("<div class='viz-container' id='viz_" + vizInfo.eID + "'></div>");

          var container = "#viz_" + vizInfo.eID;
          console.log("WIDTH: ", $(container).width());
          console.log("HEIGHT: ", $(container).height());

          var viz_w = 600;
          var viz_h = 300;

          // copied from visualization preview .... not good
          if (vizType === 'time series') {
            console.log("TIME SERIES TO DO");

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
              .type(d3PlusTypeMapping[vizType])
              .container(container)
              .width(viz_w)
              .height(viz_h)
              .margin("8px")
              .data(vizData)
              .font({
                family: "Titillium Web"
              });
          }

          if (vizType === 'shares') {
            viz.id(vizSpec.groupBy.title.toString())
              .size('value')
              .draw();
          } else if (vizType === 'scatterplot' || vizType === 'barchart' || vizType === 'linechart') {
            x = vizSpec.x.title;
            agg = vizSpec.aggregation;
            
            if (agg) {
              viz.x(x).y('count');

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
            console.log("Rendering geomap with id: ", vizSpec.groupBy.title.toString());

            return viz.title(getTitle(vizType, vizSpec))
              .coords("/assets/misc/countries.json")
              .id("id").text("label").color("count").size("count").draw();
          }
        }

        getTitle = function(vizType, vizSpec, conditional) {
          var title = '';
          if (vizType === 'shares') {
            title += "Group all " + vizSpec.aggregate.title + " by " + vizSpec.groupBy.title.toString();

            if (vizSpec.condition.title) {
              title += ' given a ' + vizSpec.condition.title.toString();
            }
          } else if (vizType === 'scatterplot' || vizType === 'barchart' || vizType === 'linechart') {
            return;
          }
          return title;
        }
      }
    };
  }
]);