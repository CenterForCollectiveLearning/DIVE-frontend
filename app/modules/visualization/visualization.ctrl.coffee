_ = require('underscore')

angular.module('diveApp.visualization').controller('VisualizationCtrl', ($scope) ->
)

angular.module('diveApp.visualization').controller('VisualizationSideNavCtrl', ($scope) ->
  # Icons
  $scope.icons =
    'comparison': [ {
      'type': 'scatter'
      'url': 'scatterplot.svg'
    } ]
    'shares': [
      {
        'type': 'tree_map'
        'url': 'treemap.svg'
      }
      {
        'type': 'pie'
        'url': 'piechart.svg'
      }
    ]
    'time series': [ {
      'type': 'line'
      'url': 'linechart.svg'
    } ]
    'distribution': [ {
      'type': 'bar'
      'url': 'barchart.svg'
    } ]

  # Sidenav methods
  $scope.toggle = (i) ->
    $scope.categories[i].toggled = !$scope.categories[i].toggled

  $scope.isOpen = (i) ->
    $scope.categories[i].toggled

  # TODO Reconcile this with selectSpec
  $scope.selectChild = (c) ->
    $scope.selectedChild = c

  $scope.isChildSelected = (c) ->
    $scope.selectedChild == c

  $scope.selectType = (t) ->
    $scope.selectedType = t
)

angular.module('diveApp.visualization').controller('VisualizationConditionalsCtrl', ($scope, ConditionalDataService) ->

  $scope.selectConditional = (spec) ->
    if spec.name of $scope.selCondVals[$scope.currentdID]
      delete $scope.selCondVals[$scope.currentdID][spec.name]
    params = 
      dID: $scope.currentdID
      spec: _.omit(spec, 'stats')
      pID: $scope.pID
    ConditionalDataService.getConditionalData params, (result) ->
      result.result.unshift 'All'
      $scope.condData[spec.name] = result.result

    $scope.refreshVizData()
)

angular.module('diveApp.visualization').controller('VisualizationStatsCtrl', ($scope) ->
)

angular.module('diveApp.visualization').controller('VisualizationExportCtrl', ($scope, $mdToast, $animate, ExportedVizSpecService) ->
  $scope.toastPosition =
    bottom: false
    top: true
    left: false
    right: true

  $scope.getToastPosition = ->
    Object.keys($scope.toastPosition).filter((pos) ->
      $scope.toastPosition[pos]
    ).join ' '

  $scope.addToCollection = ->
    # Show toast
    $mdToast.show $mdToast.simple().content('Visualization added to collection').position($scope.getToastPosition()).hideDelay(3000)
    # Hit endpoint
    params = 
      pID: $scope.pID
      spec: $scope.selectedSpec
      conditional: $scope.selCondVals
    ExportedVizSpecService.exportVizSpec params, (data) ->
      console.log 'Exported viz spec: ', data

  $scope.shareInteractive = ->

  $scope.saveStatic = (format) ->
    tmp = document.getElementById('viz-container')
    svg = tmp.getElementsByTagName('svg')[0]
    svg_xml = (new XMLSerializer).serializeToString(svg)
    $http.post(API_URL + '/api/render_svg', data: JSON.stringify(
      format: format
      svg: svg_xml)).success (data) ->
      file = undefined
      file = new Blob([ data ], type: 'application/' + format)
      saveAs file, 'visualization.' + format
)