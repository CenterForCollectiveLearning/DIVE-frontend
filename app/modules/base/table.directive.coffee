$ = require('jquery')

angular.module('diveApp.data').directive 'table', [
  '$window'
  '$timeout'
  ($window, $timeout) ->
    return {
      restrict: 'EA'
      scope:
        data: '='
        onClick: '&'
        selector: '='
        headers: '='
        height: '='
        rowheader: '='
        sortindex: '='
        sortorder: '='

      link: (scope, ele, attrs) ->

        $window.onresize = ->
          scope.$apply()
          return

        scope.$watch (->
          angular.element($window)[0].innerWidth
          return
        ), ->
          scope.render scope.data, scope.selector, scope.headers, scope.height, scope.rowheader, scope.sortindex, scope.sortorder
          return

        scope.$watchCollection '[data, selector, headers, height, rowheader, sortindex, sortorder]', ((newData) ->
          scope.render newData[0], newData[1], newData[2], newData[3], newData[4], newData[5], newData[6]
          return
        ), true

        # Resolving evaluated attribute to actual value
        # http://stackoverflow.com/questions/12371159/how-to-get-evaluated-attributes-inside-a-custom-directive
        attrs.$observe 'selector', (actual_value) ->
          ele.val 'selector=' + actual_value
          scope.selector = actual_value
          return

        scope.render = (data, selector, headers, height, rowheader, sortindex, sortorder) ->
          console.log 'Rendering table', data, selector, headers, height, rowheader, sortindex, sortorder

          if !data
            return

          pluckedHeaders = _.pluck(headers, 'name')
          console.log pluckedHeaders

          container = $(selector).get(0)
          $(container).empty()

          console.log 'container', container

          if sortindex isnt undefined
            columnSorting = {
              column: sortindex
              sortOrder: !!sortorder
            }

          spreadsheet = new Handsontable(container,
            data: data
            height: height
            colHeaders: pluckedHeaders
            columnSorting: columnSorting
            contextMenu: true
            stretchH: 'all'
            rowHeaders: rowheader
          )
          return
        return
    }
]
