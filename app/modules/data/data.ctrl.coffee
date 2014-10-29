angular.module("diveApp.data").controller "DatasetListCtrl", ($scope, $rootScope, projectID, $http, $upload, $timeout, $stateParams, DataService) ->
  $scope.selectedIndex = 0
  $scope.currentPane = 'left'

  $scope.datasets = []

  $scope.options = [
    {
      label: 'Upload File'
      inactive: false
      icon: 'file.svg'
    },
    {
      label: 'Connect to Database'
      inactive: true
      icon: 'database.svg'
    },
    {
      label: 'Connect to API'
      inactive: true
      icon: 'link.svg'
    },
    {
      label: 'Search DIVE Datasets'
      inactive: true
      icon: 'search.svg'
    }
  ]
  $scope.select_option = (index) ->
    $scope.currentPane = 'left'
    # Inactive options (for demo purposes)
    unless $scope.options[index].inactive
      $scope.selectedIndex = index

  $scope.select_dataset = (index) ->
    $scope.currentPane = 'right'
    $scope.selectedIndex = index

  $scope.types = [ "integer", "float", "string", "country", "continent", "datetime" ]

  # Initialize datasets
  DataService.promise((datasets) ->
    $scope.datasets = datasets
    console.log($scope.datasets)
  )

  ###############
  # File Upload
  ###############
  $scope.onFileSelect = ($files) ->
    i = 0
    while i < $files.length
      file = $files[i]
      $scope.upload = $upload.upload(
        url: "http://localhost:8888/api/upload"
        data:
          pID: $rootScope.pID
        file: file
      ).progress((evt) ->
        console.log "Percent loaded: " + parseInt(100.0 * evt.loaded / evt.total)
        return
      ).success((data, status, headers, config) ->
        # file is uploaded successfully
        $scope.datasets.push(data)
      )
      i++
  ###############
  # File Deletion
  ###############
  $scope.removeDataset = (dID) ->
    console.log('Removing dataset, dID:', dID)
    $http.delete('http://localhost:8888/api/data',
      params:
        pID: $rootScope.pID
        dID: dID
    ).success((result) ->
      deleted_dIDs = result
      newDatasets = []
      for dataset in $scope.datasets
        unless dataset.dID in deleted_dIDs
          newDatasets.push(dataset)
      $scope.datasets = newDatasets
    )
