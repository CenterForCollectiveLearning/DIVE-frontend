

angular.module('diveApp.visualization').controller("CreateVizCtrl", function($scope, $http, $rootScope, DataService, PropertyService, VizDataService, ConditionalDataService, SpecificationService, API_URL) {
  var icons = {
    treemap: 'treemap.svg',
    barchart: 'barchart.svg',
    piechart: 'piechart.svg',
    geomap: 'geomap.svg',
    scatterplot: 'scatterplot.svg',
    linechart: 'linechart.svg'
  };

  $scope.categories = [
    {
      name: 'shares'
    },
    {
      name: 'time series'
    },
    {
      name: 'comparison'
    },
    {
      name: 'distribution'
    },
    {
      name: 'connection'
    }
  ]

  $scope.loading = true;
  $scope.datasets = [];
  $scope.columnAttrsByDID = {};
  $scope.availableStats = {
    "geomap": [
      {
        name: "Descriptive",
        val: 'describe'
      }, {
        name: 'Chi-Square',
        val: "chisq"
      }
    ],
    "linechart": [
      {
        name: "Descriptive",
        val: 'describe'
      }, {
        name: "Gaussian",
        val: 'gaussian'
      }, {
        name: "Linear Regression",
        val: 'linregress'
      }
    ],
    "piechart": [
      {
        name: "Descriptive",
        val: 'describe'
      }, {
        name: 'Chi-Square',
        val: "chisq"
      }
    ],
    "scatterplot": [
      {
        name: "Descriptive",
        val: 'describe'
      }, {
        name: "Gaussian",
        val: 'gaussian'
      }, {
        name: "Linear Regression",
        val: 'linregress'
      }
    ],
    "treemap": [
      {
        name: "Descriptive",
        val: 'describe'
      }, {
        name: 'Chi-Square',
        val: "chisq"
      }
    ]
  };
  DataService.promise(function(datasets) {
    var d, dID, _i, _len, _results;
    $scope.datasets = datasets;
    _results = [];
    for (_i = 0, _len = datasets.length; _i < _len; _i++) {
      d = datasets[_i];
      dID = d.dID;
      _results.push($scope.columnAttrsByDID[dID] = d.column_attrs);
    }
    return _results;
  });
  PropertyService.getProperties(function(properties) {
    $scope.properties = properties;
    $scope.overlaps = properties.overlaps;
    return $scope.hierarchies = properties.hierarchies;
  });
  $scope.selectedTypeIndex = 0;
  $scope.selectedSpecIndex = 0;

  // Getting specifications grouped by category
  SpecificationService.promise(function(specs) {
    var k, v;
    $scope.categories = (function() {
      var _results = [];
      for (k in specs) {
        v = specs[k];
        _results.push({
          'name': k,
          'length': v.length,
          'icon': icons[k.toLowerCase()]
        });
      }
      return _results;
    })();
    $scope.allSpecs = specs;
    $scope.selectedType = $scope.types[$scope.selectedTypeIndex].name;
    $scope.specs = _.sortBy($scope.allSpecs[$scope.types[$scope.selectedTypeIndex].name], function(e) {
      return $scope.selectedSortOrder * e['stats'][$scope.selectedSorting];
    });
    $scope.selectSpec(0);
    $scope.selectedStats = [];
    return $scope.loading = false;
  });
  $scope.toggleStat = function(stat) {
    var idx;
    idx = $scope.selectedStats.indexOf(stat);
    if (idx < 0) {
      $scope.selectedStats.push(stat);
    } else {
      $scope.selectedStats.splice(idx, 1);
    }
    return console.log("Selected Stats: ", $scope.selectedStats);
  };
  $scope.chooseSpec = function(index) {
    var spec;
    spec = $scope.specs[index];
    return $http.get(API_URL + '/api/choose_spec', {
      params: {
        pID: $rootScope.pID,
        sID: spec.sID,
        conditional: $scope.selCondVals
      }
    }).success(function(result) {
      return spec.chosen = true;
    });
  };
  $scope.rejectSpec = function(index) {
    var spec;
    spec = $scope.specs[index];
    return $http.get(API_URL + '/api/reject_spec', {
      params: {
        pID: $rootScope.pID,
        sID: $scope.specs[index].sID
      }
    }).success(function(result) {
      return spec.chosen = false;
    });
  };
  $scope.selectType = function(index) {
    $scope.selectedStats = [];
    $scope.selectedTypeIndex = index;
    $scope.selectedType = $scope.types[index].name;
    $scope.specs = _.sortBy($scope.allSpecs[$scope.types[$scope.selectedTypeIndex].name], function(e) {
      return $scope.selectedSortOrder * e['stats'][$scope.selectedSorting];
    });
    return $scope.selectSpec(0);
  };
  $scope.selectSpec = function(index) {
    var colAttrs, colStatsByName, cond, dID, name, params, _i, _len;
    $scope.selectedSpecIndex = index;
    $scope.selectedSpec = $scope.specs[index];
    if ($scope.selectedSpec.aggregate) {
      dID = $scope.selectedSpec.aggregate.dID;
    } else {
      dID = $scope.selectedSpec.object.dID;
    }
    $scope.currentdID = dID;
    if (!$scope.selCondVals[dID]) {
      $scope.selCondVals[dID] = {};
    }
    colAttrs = $scope.columnAttrsByDID[dID];
    colStatsByName = $scope.properties.stats[dID];
    $scope.condList = [];
    for (_i = 0, _len = colAttrs.length; _i < _len; _i++) {
      cond = colAttrs[_i];
      name = cond.name;
      $scope.condTypes[name] = cond.type;
      if (name in colStatsByName) {
        cond.stats = colStatsByName[name];
      }
      $scope.condList.push(cond);
    }
    params = {
      type: $scope.selectedType,
      spec: $scope.selectedSpec,
      conditional: $scope.selCondVals
    };
    return VizDataService.promise(params, function(result) {
      $scope.vizData = result.result;
      $scope.vizStats = result.stats;
      return $scope.loading = false;
    });
  };
  $scope.sortings = [
    {
      property: 'num_elements',
      display: 'Number of Elements'
    }, {
      property: 'std',
      display: 'Standard Deviation'
    }
  ];
  $scope.sortOrders = [
    {
      property: 1,
      display: 'Ascending'
    }, {
      property: -1,
      display: 'Descending'
    }
  ];
  $scope.selectedSorting = $scope.sortings[0].property;
  $scope.selectedSortOrder = $scope.sortOrders[0].property;
  $scope.sortSpecs = function() {
    return $scope.specs = _.sortBy($scope.specs, function(e) {
      return $scope.selectedSortOrder * e['stats'][$scope.selectedSorting];
    });
  };
  $scope.condList = [];
  $scope.condTypes = {};
  $scope.condData = {};
  $scope.selCondVals = {};
  $scope.isNumeric = function(type) {
    if (type === "float" || type === "integer") {
      return true;
    } else {
      return false;
    }
  };
  $scope.selectConditional = function(spec) {
    var high, low, params;
    if (spec.name in $scope.condData) {
      delete $scope.condData[spec.name];
    } else {
      if ($scope.isNumeric(spec.type)) {
        low = parseFloat(Math.floor(spec.stats.min));
        high = parseFloat(Math.floor(spec.stats.max));
        $scope.condData[spec.name] = {
          step: 1,
          floor: low,
          ceiling: high
        };
        $scope.selCondVals[$scope.currentdID][spec.name] = {
          type: 'numeric',
          low: low,
          high: high
        };
      } else {
        ConditionalDataService.promise($scope.currentdID, spec, function(result) {
          var data;
          data = result.result.unshift('All');
          return $scope.condData[spec.name] = result.result;
        });
      }
      params = {
        type: $scope.selectedType,
        spec: $scope.selectedSpec,
        conditional: $scope.selCondVals
      };
      VizDataService.promise(params, function(result) {
        $scope.vizData = result.result;
        $scope.vizStats = result.stats;
        return $scope.loading = false;
      });
    }
    return $scope.$broadcast('refreshSlider');
  };
  $scope.changedConditional = function(title) {
    var params;
    params = {
      type: $scope.selectedType,
      spec: $scope.selectedSpec,
      conditional: $scope.selCondVals
    };
    return VizDataService.promise(params, function(result) {
      $scope.vizData = result.result;
      $scope.vizStats = result.stats;
      return $scope.loading = false;
    });
  };
  $scope.selectedConditional = function(name) {
    if (name in $scope.condData) {
      return true;
    }
    return false;
  };
});