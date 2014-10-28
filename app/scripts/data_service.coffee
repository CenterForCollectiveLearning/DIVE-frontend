angular.module('diveApp.services', ['ui.router', 'angularFileUpload'])

# Container for data services
angular.module('diveApp.services').service "AllProjectsService", ($http, $rootScope) ->
  promise: (userName, callback) ->
    # console.log("[REQUEST] all projects for user:", userName)
    $http.get('http://localhost:8888/api/project',
      params:
        user_name: userName
    ).success((result) ->
      callback(result)
    )

# TODO Eventually deprecate this in favor of real session handling
angular.module('diveApp.services').service "ProjectIDService", ($http, $stateParams, $rootScope) ->
  promise: (formattedProjectTitle) ->
    # console.log("[REQUEST] projectID for project title:", formattedProjectTitle)
    $http.get("http://localhost:8888/api/getProjectID",
      params:
        formattedProjectTitle: formattedProjectTitle
    ).success((pID) ->
      # console.log("[DATA] projectID:", pID)
      $rootScope.pID = pID
    )

# Dataset Samples
angular.module('diveApp.services').service "DataService", ($http, $rootScope) ->
  promise: (callback) ->
    # console.log("[REQUEST] data for pID", $rootScope.pID)
    $http.get("http://localhost:8888/api/data",
      params:
        pID: $rootScope.pID
        sample: true
    ).success((data) ->
      # console.log("[DATA] datasets:", data)
      callback(data.datasets)
    )

angular.module('diveApp.services').service "PropertyService", ($http, $rootScope) ->
  promise: (callback) ->
    # console.log("[REQUEST] properties for pID", $rootScope.pID)
    $http.get("http://localhost:8888/api/property",
      params:
        pID: $rootScope.pID
    ).success((data) ->
      # console.log("[DATA] properties:", data)
      callback(data)
    )

angular.module('diveApp.services').service "SpecificationService", ($http, $rootScope) ->
  promise: (callback) ->
    # console.log("[REQUEST] specifications for pID", $rootScope.pID)
    $http.get("http://localhost:8888/api/specification",
      params:
        pID: $rootScope.pID
    ).success((data) ->
      # console.log("[DATA] specifications:", data)
      callback(data)
    )

angular.module('diveApp.services').service "ConditionalDataService", ($http, $rootScope) ->
  # TODO Generalize service for other vizTypes
  promise: (dID, spec, callback) ->
    # console.log('[REQUEST] Conditional Data for Type', type, 'and Specification ', spec)
    $http.get("http://localhost:8888/api/conditional_data",
      params:
        pID: $rootScope.pID
        dID: dID
        spec: spec
    ).success((data) ->
      console.log("[DATA] Conditional Data:", data)
      callback(data)
    )

angular.module('diveApp.services').service "VizDataService", ($http, $rootScope) ->
  # TODO Generalize service for other vizTypes
  promise: (type, spec, conditional, callback) ->
    # console.log('[REQUEST] Viz Data for Type', type, 'and Specification ', spec)
    $http.get("http://localhost:8888/api/visualization_data",
      params:
        pID: $rootScope.pID
        type: type
        spec: spec
        conditional: conditional
    ).success((data) ->
      # console.log("[DATA] Viz Data:", data)
      callback(data)
    )

angular.module('diveApp.services').service "ExportedVisualizationDataService", ($http, $rootScope) ->
  # TODO Generalize service for other vizTypes
  promise: (type, spec, conditional, callback) ->
    # console.log('[REQUEST] Viz Data for Type', type, 'and Specification ', spec)
    $http.get("http://localhost:8888/api/visualization_data",
      params:
        pID: $rootScope.pID
        type: type
        spec: spec
        conditional: conditional
    ).success((data) ->
      # console.log("[DATA] Viz Data:", data)
      callback(data)
    )