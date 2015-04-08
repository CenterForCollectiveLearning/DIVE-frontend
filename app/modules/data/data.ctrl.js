var __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

angular.module("diveApp.data").controller("DatasetListCtrl", function($scope, $rootScope, $mdSidenav, projectID, $http, $upload, $timeout, $stateParams, DataService, PublicDataService, API_URL) {
  $scope.datasets = [];
  $scope.publicDatasets = [];
  $scope.dIDs = [];

  // Data from services
  DataService.promise(function(datasets) {
    $scope.datasets = datasets;
    console.log($scope.datasets);
  });
  PublicDataService.promise('GET', {
    sample: true
  }, function(publicDatasets) {
    $scope.publicDatasets = publicDatasets;
  });

  $scope.sections = [
    {
      name: 'Add Datasets',
      type: 'heading',
      children: [
        {
          name: 'Upload File',
          id: 'upload',
          type: 'pane'
        },
        {
          name: 'Preloaded Datasets',
          id: 'preloaded',
          type: 'pane'
        }
      ]
    }
  ]
  $scope.selectedChild = $scope.sections[0].children[0];

  $scope.selectChild = function(c) {
    $scope.selectedChild = c;
  }

  $scope.isChildSelected = function(c) {
    return ($scope.selectedChild === c);
  }

  $scope.toggle = function() {
    return true;
  }

  $scope.isOpen = function() {
    return true;
  }

  $scope.addPublicDataset = function(d) {
    var params;
    console.log("adding Public Dataset", d);
    params = {
      dID: d.dID,
      pID: $rootScope.pID
    };
    return PublicDataService.promise('POST', params, function(datasets) {
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
  $scope.selectedStructure = function(structure) {
    var datasetStructure;
    datasetStructure = $scope.datasets[$scope.selectedIndex].structure;
    if (structure === datasetStructure) {
      return true;
    } else {
      return false;
    }
  };
  $scope.selectStructure = function(structure) {
    return $scope.datasets[$scope.selectedIndex].structure = structure;
  };
  $scope.onFileSelect = function($files) {
    var file, i, _results;
    i = 0;
    _results = [];
    while (i < $files.length) {
      file = $files[i];
      $scope.upload = $upload.upload({
        url: API_URL + "/api/upload",
        data: {
          pID: $rootScope.pID
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
        return console.log($scope.datasets);
      });
      _results.push(i++);
    }
    return _results;
  };
  $scope.removeDataset = function(dID) {
    console.log('Removing dataset, dID:', dID);
    return $http["delete"](API_URL + '/api/data', {
      params: {
        pID: $rootScope.pID,
        dID: dID
      }
    }).success(function(result) {
      var dataset, deleted_dIDs, newDIDs, newDatasets, _i, _len, _ref, _ref1;
      deleted_dIDs = result;
      newDIDs = [];
      newDatasets = [];
      _ref = $scope.datasets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        dataset = _ref[_i];
        if (_ref1 = dataset.dID, __indexOf.call(deleted_dIDs, _ref1) < 0) {
          newDatasets.push(dataset);
          newDIDs.push(dataset.dID);
        }
      }
      $scope.datasets = newDatasets;
      return $scope.dIDs = newDIDs;
    });
  };
});