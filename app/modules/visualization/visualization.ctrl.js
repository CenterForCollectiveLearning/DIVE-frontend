var _ = require('underscore');

angular.module('diveApp.visualization').controller("CreateVizCtrl", function($scope, $http, $rootScope, DataService, PropertyService, VizDataService, ConditionalDataService, SpecificationService, API_URL) {
  $scope.datasets = [];
  $scope.columnAttrsByDID = {};
  $scope.categories = [];

  // CONDITIONALS
  $scope.condList = [];
  $scope.condTypes = {};
  $scope.condData = {};
  $scope.selCondVals = {};

  // Sidenav data
  $scope.sortFields = [
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
  $scope.filters = {
    sortField: $scope.sortFields[0].property,
    sortOrder: $scope.sortOrders[0].property
  }

  // Sidenav methods
  $scope.toggle = function(i) {
    $scope.categories[i].toggled = !$scope.categories[i].toggled;
  }

  $scope.isOpen = function(i) {
    return $scope.categories[i].toggled;
  }

  // TODO Reconcile this with selectSpec
  $scope.selectChild = function(c) {
    console.log(c);
    $scope.selectedChild = c;
  }

  $scope.isChildSelected = function(c) {
    return ($scope.selectedChild === c);
  }

  $scope.selectSpec = function(spec) {
    $scope.selectedChild = spec;
    $scope.selectedSpec = spec;
    console.log("Selected spec:", spec);

    if (spec.aggregate) {
      dID = spec.aggregate.dID;
    } else {
      dID = spec.object.dID;
    }
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

    var params = {
      spec: spec,
      conditional: {}
    };
    VizDataService.promise(params, function(result) {
      $scope.vizData = result.result;
      $scope.vizStats = result.stats;
    });
  }

  // Getting specifications grouped by category
  SpecificationService.promise(function(specs) {
    for (var k in specs) {
      var v = specs[k];
      $scope.categories.push({
        'name': k,
        'toggled': true,
        'length': v.length,
        'specs': v
      });
    }
  });

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
        // low = parseFloat(Math.floor(spec.stats.min));
        // high = parseFloat(Math.floor(spec.stats.max));
        // $scope.condData[spec.name] = {
        //   step: 1,
        //   floor: low,
        //   ceiling: high
        // };
        // $scope.selCondVals[$scope.currentdID][spec.name] = {
        //   type: 'numeric',
        //   low: low,
        //   high: high
        // };
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