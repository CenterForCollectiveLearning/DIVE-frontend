# Container for data services
diveApp.service "AllProjectsService", ($http, $rootScope) ->
  promise: (userName, callback) ->
    # console.log("[REQUEST] all projects for user:", userName)
    $http.get('http://localhost:8888/api/project',
      params:
        user_name: userName
    ).success((result) ->
      callback(result)
    )

# TODO Eventually deprecate this in favor of real session handling
engineApp.service "ProjectIDService", ($http, $stateParams, $rootScope) ->
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
engineApp.service "DataService", ($http, $rootScope) ->
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

engineApp.service "PropertyService", ($http, $rootScope) ->
  promise: (callback) ->
    # console.log("[REQUEST] properties for pID", $rootScope.pID)
    $http.get("http://localhost:8888/api/property",
      params:
        pID: $rootScope.pID
    ).success((data) ->
      # console.log("[DATA] properties:", data)
      callback(data)
    )

engineApp.service "SpecificationService", ($http, $rootScope) ->
  promise: (callback) ->
    # console.log("[REQUEST] specifications for pID", $rootScope.pID)
    $http.get("http://localhost:8888/api/specification",
      params:
        pID: $rootScope.pID
    ).success((data) ->
      # console.log("[DATA] specifications:", data)
      callback(data)
    )

engineApp.service "ConditionalDataService", ($http, $rootScope) ->
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

engineApp.service "VizDataService", ($http, $rootScope) ->
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

engineApp.service "ExportedVisualizationDataService", ($http, $rootScope) ->
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