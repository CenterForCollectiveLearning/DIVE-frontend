var _ = require('underscore');

var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module("diveApp.data").controller("UploadCtrl", function($scope, $http, $upload, pID, API_URL) {
  $scope.onFileSelect = function(files) {
    var file;
    var i = 0;
    var results = [];
    while (i < files.length) {
      file = files[i];
      $scope.upload = $upload.upload({
        url: API_URL + "/api/upload",
        data: {
          pID: pID
        },
        file: file
      }).progress(function(evt) {
        console.log("Percent loaded: " + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
        var dataset, _i, _len, _ref;
        _ref = data.datasets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          dataset = _ref[_i];
          $scope.datasets.push(dataset);
          $scope.dIDs.push(dataset.dID);
        }
      });
      results.push(i++);
    }
    return results;
  };
});

angular.module("diveApp.data").controller("InspectDataCtrl", function($scope, $http, pID, API_URL) {
  $scope.isTimeSeries = function(i, ts) {
    if ((i >= ts.start.index) && (i <= ts.end.index)) {
      return true;
    } else {
      return false;
    }
  }

  // TODO Factor out into a data service
  $scope.removeDataset = function(dID) {
    console.log('Removing dataset, dID:', dID);
    return $http["delete"](API_URL + '/api/data', {
      params: {
        pID: pID,
        dID: dID
      }
    }).success(function(result) {
      var deleted_dIDs = result;
      var newDIDs = [];
      var newDatasets = [];

      // Update datasets and dIDs
      _.each($scope.datasets, function(d) {
        if (deleted_dIDs.indexOf(d.dID) < 0) {
          newDatasets.push(d);          
          newDIDs.push(d.dID);
        }
      });

      $scope.datasets = newDatasets;
      $scope.dIDs = newDIDs;
    });
  };
})

angular.module("diveApp.data").controller("PreloadedDataCtrl", function($scope, PreloadedDataService) {
  PreloadedDataService.getPreloadedDatasets({}, function(r) {
    $scope.preloadedDatasets = r;
  });

  $scope.addPreloadedDataset = function(d) {
    var params = {
      dID: d.dID,
      pID: pID
    };
    PublicDataService.promise('POST', params, function(datasets) {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = datasets.length; _i < _len; _i++) {
        d = datasets[_i];
        $scope.datasets.push(d);
        _results.push($scope.dIDs.push(d.dID));
      }
      return _results;
    });
  };
})

angular.module("diveApp.data").controller("DataCtrl", function($scope, $state, DataService, pID) {
  $scope.datasets = [];
  $scope.preloadedDatasets = [];

  DataService.getDatasets({ pID: pID }, function(r) {
    $scope.datasets = r;
    $scope.dIDs = _.pluck($scope.datasets, 'dID');
  });

  $scope.sections = [
    {
      name: 'Add Datasets',
      type: 'heading',
      children: [
        {
          name: 'Upload File',
          id: 'upload',
          type: 'pane',
          state: 'project.data.upload'
        },
        {
          name: 'Preloaded Datasets',
          id: 'preloaded',
          type: 'pane',
          state: 'project.data.preloaded'
        }
      ]
    }
  ]

  $scope.toggleStates = {
    data: true
  };

  $scope.selectedChild = $scope.sections[0].children[0];

  $scope.selectChild = function(c) {
    $scope.selectedChild = c;
    $state.go(c.state);
  }

  $scope.selectDataset = function(d) {
    $scope.selectedChild = d;
    $state.go('project.data.inspect', { dID: d.dID });
  }

  $scope.isChildSelected = function(c) {
    return ($scope.selectedChild === c);
  }

  $scope.toggle = function(k) {
    $scope.toggleStates[k] = !$scope.toggleStates[k];
  }

  $scope.isOpen = function(k) {
    return $scope.toggleStates[k];
  }

  $scope.types = ["integer", "float", "string", "countryCode2", "countryCode3", "countryName", "continent", "datetime"];

  $scope.structures = [
    {
      name: 'long',
      displayName: 'Long (Record or stacked format)'
    }, {
      name: 'wide',
      displayName: 'Wide (Matrix-like)'
    }
  ];  
});