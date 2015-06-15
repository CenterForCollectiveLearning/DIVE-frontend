$ = require('jquery');
require('underscore');
require('d3');

angular.module('diveApp.visualization').directive("histogram", [
  "$window", "$timeout", function($window, $timeout) {
    return {
      restrict: "EA",
      scope: {
        data: "=",
        selector: "=",
        title: "=",
        label: "=",
        selectedValues: "=",
        onClick: "&"
      },
      link: function(scope, ele, attrs) {
        var renderTimeout;

        $window.onresize = function() { scope.$apply(); };

        scope.$watch((function() {
          angular.element($window)[0].innerWidth;
        }), function() {
          scope.render(scope.data, scope.selector, scope.title, scope.selectedValues);
        });

        scope.$watchCollection("[data, selector, title, selectedValues]", (function(newData) {
          scope.render(newData[0], newData[1], newData[2], newData[3]);
        }), true);

        scope.$watch('selectedValues', (function(selectedValues) {
          scope.render(scope.data, scope.selector, scope.title, selectedValues);
        }), true);

        scope.render = function(data, selector, title, selectedValues) {
          if (!data) { return; }
          if (renderTimeout) { clearTimeout(renderTimeout); }

          return renderTimeout = $timeout(function() {

           var formattedData = []
           for (var k in data) {
             var v = data[k];
             if (selectedValues[k]) {
               formattedData.push({'name': k, 'value': v});              
             }
           }


           var width = $('div.stats div.content').innerWidth();
           var height = Math.max(100, formattedData.length * 30); // $('div.stats div.content').innerHeight();

           MG.data_graphic({
            title: title,
            data: formattedData,
            baseline_accessor: null,
            predictor_accessor: null,
            chart_type: 'bar',
            x_accessor: 'value',
            y_accessor: 'name',
            left: 150,
            width: width,
            height: height,
            animate_on_load: true,
            target: selector
          });

           // var width = 420,
           //     barHeight = 20;
           
           // var x = d3.scale.linear()
           //     .domain([0, d3.max(formattedData, function(d) { return d.value; })])
           //     .range([0, width]);
           
           // var chart = d3.select(selector)
           //     .attr("width", width)
           //     .attr("height", barHeight * formattedData.length);
           
           // var bar = chart.selectAll("g")
           //       .data(formattedData)
           //     .enter().append("g")
           //       .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });
           
           // bar.append("rect")
           //     .attr("width", function(d) { return x(d.value); })
           //     .attr("height", barHeight - 1);
         
           // bar.append("text")
           //     .attr("x", function(d) { return x(d.value) - 3; })
           //     .attr("y", barHeight / 2)
           //     .attr("dy", ".35em")
           //     .text(function(d) { return d.value; });
          }, 200);
        };
      }
    };
  }
]);