$ = require('jquery')

angular.module('diveApp.data').directive 'datatable', [
  '$window'
  '$timeout'
  ($window, $timeout) ->
    return {
      restrict: 'EA'
      scope:
        data: '='
        onClick: '&'
        selector: '@'
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

        scope.render = (data, selector, headers, height, rowheader, sortindex, sortorder) ->
          console.log 'Rendering table', data, selector, headers, height, rowheader, sortindex, sortorder

          if !data
            return

          if headers[0].name
            headers = headers.slice()
            headers = _.pluck(headers, 'name')

          _container = $(selector).get(0)
          $(_container).empty()

          if sortindex isnt undefined
            _columnSorting =
              column: sortindex
              sortOrder: !!sortorder

          _params = 
            data: data
            height: height
            colHeaders: headers
            columnSorting: _columnSorting
            contextMenu: true
            stretchH: 'all'
            rowHeaders: rowheader

          spreadsheet = new Handsontable(_container, _params)
          return
        return
    }
]
