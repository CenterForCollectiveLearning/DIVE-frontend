_ = require('underscore')
require 'handsontable'

angular.module('diveApp.data').controller 'UploadCtrl', ($scope, $http, $upload, API_URL, pIDRetrieved, datasetsListRetrieved) ->
  $scope.onFileSelect = (files) ->
    i = 0
    results = []
    return pIDRetrieved.promise.then ->
      while i < files.length
        file = files[i]

        $scope.upload = $upload.upload(
          url: API_URL + '/api/upload'
          data: pID: $scope.pID
          file: file).progress((evt) ->
          console.log 'Percent loaded: ' + parseInt(100.0 * evt.loaded / evt.total)
          return
        ).success((data, status, headers, config) ->
          datasetsListRetrieved.promise.then =>
            _i = 0
            _len = data.datasets.length
            while _i < _len
              dataset = data.datasets[_i]
              $scope.datasets.push dataset
              $scope.dIDs.push dataset.dID
              _i++
            return
          return
        )
        results.push i++
      return results
  return

angular.module('diveApp.data').controller 'InspectDataCtrl', ($scope, $http, $stateParams, API_URL, DataService) ->
  $scope.datasetSettingsVisible = false

  DataService.getDataset($stateParams.dID).then (dataset) ->
    $scope.dataset = dataset
    return

  $scope.toggleDatasetSettings = ->
    $scope.datasetSettingsVisible = !$scope.datasetSettingsVisible

  $scope.isTimeSeries = (i, ts) ->
    return (ts and ts.start and i >= ts.start.index and i <= ts.end.index)

  $scope.$watch 'datasets', (current, old) ->
    _selected_dataset = _.findWhere($scope.datasets, dID: $stateParams.dID)

    if _selected_dataset
      $scope.selectDataset _selected_dataset

    return

  # TODO Factor out into a data service
  $scope.removeDataset = (dID) ->
    console.log 'Removing dataset, dID:', dID
    return $http['delete'](API_URL + '/api/datasets',
      params:
        pID: $scope.pID
        dID: dID
    ).success (result) ->
      deleted_dIDs = result
      newDIDs = []
      newDatasets = []

      # Update datasets and dIDs
      _.each $scope.datasets, (d) ->
        if deleted_dIDs.indexOf(d.dID) < 0
          newDatasets.push d
          newDIDs.push d.dID
        return

      $scope.datasets = newDatasets
      $scope.dIDs = newDIDs
      return
  return

angular.module('diveApp.data').controller 'PreloadedDataCtrl', ($scope, PreloadedDataService) ->
  PreloadedDataService.getPreloadedDatasets {}, (r) ->
    $scope.preloadedDatasets = r
    return

  $scope.addPreloadedDataset = (d) ->
    params = 
      dID: d.dID
      pID: $scope.pID

    PublicDataService.promise 'POST', params, (datasets) ->
      _results = []
      _i = 0
      _len = datasets.length

      while _i < _len
        d = datasets[_i]
        $scope.datasets.push d
        _results.push $scope.dIDs.push(d.dID)
        _i++
      return _results
    return
  return

angular.module('diveApp.data').controller 'DataCtrl', ($scope, $state, DataService, pIDRetrieved, datasetsListRetrieved) ->
  $scope.datasets = []
  $scope.preloadedDatasets = []
  $scope.selectedDataset = null

  pIDRetrieved.promise.then ->
    DataService.getDatasets().then (datasets) ->
      $scope.datasets = datasets
      $scope.dIDs = _.pluck($scope.datasets, 'dID')
      datasetsListRetrieved.q.resolve()

      console.log 'Got datasets list', $scope.datasets
      return
    return

  $scope.sections = [
    {
      name: 'Add Datasets'
      type: 'heading'
      children: [
        {
          name: 'Upload File'
          id: 'upload'
          type: 'pane'
          state: 'project.data.upload'
        }
        {
          name: 'Preloaded Datasets'
          id: 'preloaded'
          type: 'pane'
          state: 'project.data.preloaded'
        }
      ]
    }
  ]

  $scope.toggleStates =
    data: true

  $scope.selectDataset = (d) ->
    $scope.selectedDataset = d

    if d
      $state.go 'project.data.inspect', { dID: d.dID }
    else
      $state.go 'project.data.upload'
    return

  $scope.toggle = (k) ->
    $scope.toggleStates[k] = !$scope.toggleStates[k]
    return

  $scope.isOpen = (k) ->
    $scope.toggleStates[k]

  $scope.types = [
    'integer'
    'float'
    'string'
    'countryCode2'
    'countryCode3'
    'countryName'
    'continent'
    'datetime'
  ]

  $scope.structures = [
    {
      name: 'long'
      displayName: 'Long (Record or stacked format)'
    }
    {
      name: 'wide'
      displayName: 'Wide (Matrix-like)'
    }
  ]

  return
