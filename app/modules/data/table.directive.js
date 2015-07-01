$ = require('jquery');
angular.module('diveApp.data').directive("table", [
  "$window", "$timeout", function($window, $timeout) {
    return {
      restrict: "EA",
      scope: {
        data: "=",
        onClick: "&",
        selector: "=",
        headers: "="
      },
      link: function(scope, ele, attrs) {
        var renderTimeout;

        $window.onresize = function() { scope.$apply(); };

        scope.$watch((function() {
          angular.element($window)[0].innerWidth;
        }), function() {
          scope.render(scope.data, scope.selector, scope.headers);
        });

        scope.$watchCollection("[data, selector, headers]", (function(newData) {
          scope.render(newData[0], newData[1], newData[2]);
        }), true);

        // Resolving evaluated attribute to actual value
        // http://stackoverflow.com/questions/12371159/how-to-get-evaluated-attributes-inside-a-custom-directive
        attrs.$observe('selector', function(actual_value) {
          ele.val("selector=" + actual_value);
          scope.selector = actual_value;
        });

        scope.render = function(data, selector, headers) {
          console.log("Rendering table", data, selector, headers);
          if (!data) { return; }
          if (renderTimeout) { clearTimeout(renderTimeout); }

          return renderTimeout = $timeout(function() {

          var pluckedHeaders = _.pluck(headers, 'name');
          console.log(pluckedHeaders);

          var container = $(selector).get(0);
          console.log('container', container);
          var hot = new Handsontable(container, {
            data: data,
            height: 500,
            colHeaders: pluckedHeaders,
            rowHeaders: true,
            stretchH: 'all',
            columnSorting: true,
            contextMenu: true
          });

          }, 200);
        };
      }
    };
  }
]);

      