var _ = require('underscore');
require('metrics-graphics')

angular.module('diveApp.visualization').controller("CreateVizCtrl", function($scope, $http, $rootScope, DataService, PropertyService, VizDataService, ConditionalDataService, SpecificationService, API_URL) {
  $scope.datasets = [];
  $scope.columnAttrsByDID = {};
  $scope.categories = [];

  $scope.icons = {
    'shares': {
      treemap: 'treemap.svg',
    },
    'time series': {
      linechart: 'linechart.svg'
    }
  };

  // Stats
  $scope.stats = { shown: false }

  // Loading
  $scope.loadingViz = false;

  // CONDITIONALS
  $scope.condList = [];
  $scope.condTypes = {};
  $scope.condData = {};  
  $scope.selConds = {};  // Which are selected to be shown
  $scope.selCondVals = {};  // Selected values for conditionals

  // CONFIG
  $scope.config = {};
  $scope.selectedValues = {};
  $scope.selectedParameters = {
    x: '',
    y: ''
  }

  DataService.promise(function(datasets) {
    console.log("DataService", datasets)
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

  // TODO Find a better way to resolve data dependencies without just making everything synchronous
  PropertyService.getProperties(function(properties) {
    $scope.properties = properties;
    $scope.overlaps = properties.overlaps;
    $scope.hierarchies = properties.hierarchies;

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
      $scope.selectSpec($scope.categories[1].specs[0])
    });
  });


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
    $scope.selectedChild = c;
  }

  $scope.isChildSelected = function(c) {
    return ($scope.selectedChild === c);
  }

  $scope.selectSpec = function(spec) {
    $scope.selectedChild = spec;
    $scope.selectedSpec = spec;

    if (spec.aggregate) {
      dID = spec.aggregate.dID;
    } else {
      dID = spec.object.dID;
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
      if (!$scope.isNumeric(cond.type)) {
        $scope.condList.push(cond);        
      }
    }

    // Get X and Y and group parameters for comparisons
    if (spec.viz_type === 'comparison') {
      var params = {
        dID: $scope.currentdID,
        name: spec.groupBy.title
      }
      ConditionalDataService.promise($scope.currentdID, params, function(result) {
        $scope.selectedParameters.x = result.result[0];
        $scope.selectedParameters.y = result.result[1];
        $scope.parametersData = result.result;
        $scope.condData[spec.groupBy.title] = result.result;
      });
    }

    $scope.loadingViz = true;
    var params = {
      spec: spec,
      conditional: $scope.selCondVals
    };
    VizDataService.promise(params, function(result) {
      $scope.loadingViz = false;
      $scope.vizData = result.result;
      $scope.vizStats = result.stats;
      var means = result.stats.means;

      var selectedValues = {};
      var sortedMeans = Object.keys(means).sort(function(a,b){return means[b]-means[a]});
      for (var i=0; i < sortedMeans.length; i++) {
        var x = sortedMeans[i]
        if (i < 10) { 
          selectedValues[x] = true;
        } else {
          selectedValues[x] = false;
        }
      }
      $scope.selectedValues = selectedValues;
    });
  }
  $scope.isNumeric = function(type) {
    if (type === "float" || type === "integer") {
      return true;
    } else {
      return false;
    }
  };
  $scope.selectConditional = function(spec) {
    ConditionalDataService.promise($scope.currentdID, spec, function(result) {
      result.result.unshift('All')
      $scope.condData[spec.name] = result.result;
    });
    $scope.refreshVizData();
  };

  $scope.refreshVizData = function() {
    $scope.loadingViz = true;
    var params = {
      type: $scope.selectedType,
      spec: $scope.selectedSpec,
      conditional: $scope.selCondVals
    };
    VizDataService.promise(params, function(result) {
      $scope.vizData = result.result;
      $scope.vizStats = result.stats;
      $scope.loadingViz = false;

      var means = result.stats.means;

      var selectedValues = {};
      var sortedMeans = Object.keys(means).sort(function(a,b){return means[b]-means[a]});
      for (var i=0; i < sortedMeans.length; i++) {
        var x = sortedMeans[i]
        if (i < 10) { 
          selectedValues[x] = true;
        } else {
          selectedValues[x] = false;
        }
      }
      $scope.selectedValues = selectedValues;
    });
  };

   $scope.save = function(format) {
     var svg, svg_xml, tmp;
     tmp = document.getElementById("viz-container");
     svg = tmp.getElementsByTagName("svg")[0];
     svg_xml = (new XMLSerializer).serializeToString(svg);
     return $http.post(API_URL + "/api/render_svg", {
       data: JSON.stringify({
         format: format,
         svg: svg_xml
       })
     }).success(function(data) {
       var file;
       file = new Blob([data], {
         type: 'application/' + format
       });
       return saveAs(file, 'visualization.' + format);
     });
   };

});