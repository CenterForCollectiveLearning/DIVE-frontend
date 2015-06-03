$ = require('jquery');
require('underscore');
require('d3');

angular.module('diveApp.visualization').directive("scatterplot", [
  "$window", "$timeout", function($window, $timeout) {
    return {
      restrict: "EA",
      scope: {
        data: "=",
        entities: "=",
        selector: "@",
        // title: "=",
        // label: "=",
        // selectedValues: "=",
        onClick: "&"
      },
      link: function(scope, ele, attrs) {
        var renderTimeout;

        $window.onresize = function() { scope.$apply(); };

        scope.$watch((function() {
          angular.element($window)[0].innerWidth;
        }), function() {
          scope.render(scope.data, scope.entities, scope.selector);
        });

        scope.$watchCollection("[data, entities, selector]", (function(newData) {
          scope.render(newData[0], newData[1], newData[2]);
        }), true);

        scope.$watch('selectedValues', (function(selectedValues) {
          scope.render(scope.data, scope.entities, scope.selector);
        }), true);

        // Resolving evaluated attribute to actual value
        // http://stackoverflow.com/questions/12371159/how-to-get-evaluated-attributes-inside-a-custom-directive
        attrs.$observe('selector', function(actual_value) {
          ele.val("selector=" + actual_value);
          scope.selector = actual_value;
        });

        scope.render = function(data, entities, selector) {
          console.log("Rendering scatterplot", data, entities, selector)
          if (!data) { return; }
          if (renderTimeout) { clearTimeout(renderTimeout); }

          return renderTimeout = $timeout(function() {

          console.log("Rendering scatterplot", data, entities, selector)
          var split_entities = entities.split('\t');
          var x_name = split_entities[0];
          var y_name = split_entities[1];

          //  var formattedData = []
          //  for (var k in data) {
          //    var v = data[k];
          //    if (selectedValues[k]) {
          //      formattedData.push({'name': k, 'value': v});              
          //    }
          //  }


          //  var width = $('div.stats div.content').innerWidth();
          //  var height = Math.max(100, formattedData.length * 30); // $('div.stats div.content').innerHeight();

          var title = x_name + ' vs. ' + y_name;
           MG.data_graphic({
            title: title,
            data: data,
            chart_type: 'point',
            least_squares: true,
            x_accessor: x_name,
            y_accessor: y_name,
            full_width: true,
            height: 300,
            // full_height: true,
            animate_on_load: true,
            target: selector
          });

          }, 200);
        };
      }
    };
  }
]);