angular = require('angular')
angularFileUpload = require('angular-file-upload')
_ = require('underscore')
angularCookies = require('angular-cookies')

angular.module('diveApp.services', ['ui.router', 'angularFileUpload', 'ngCookies'])

# Container for data services
angular.module('diveApp.services').service "AllProjectsService", ($http, $rootScope, API_URL) ->
  promise: (userName, callback) ->
    # console.log("[REQUEST] all projects for user:", userName)
    $http.get(API_URL + '/api/project',
      params:
        user_name: userName
    ).success((result) ->
      callback(result)
    )

# TODO Eventually deprecate this in favor of real session handling
angular.module('diveApp.services').service "ProjectIDService", ($http, $stateParams, $rootScope, API_URL) ->
  promise: (formattedProjectTitle) ->
    # console.log("[REQUEST] projectID for project title:", formattedProjectTitle)
    $http.get(API_URL + "/api/getProjectID",
      params:
        formattedProjectTitle: formattedProjectTitle
    ).success((pID) ->
      # console.log("[DATA] projectID:", pID)
      $rootScope.pID = pID
    )

angular.module('diveApp.services').service "ProjectService", ($http, $stateParams, $rootScope, API_URL) ->
  promise: (pID, userName, callback) ->
    # console.log "Get specific project", pID, userName
    $http.get(API_URL + "/api/project",
      params:
        user_name: userName
        pID: pID
    ).success(callback)
# Dataset Samples
angular.module('diveApp.services').service "DataService", ($http, $rootScope, API_URL) ->
  promise: (callback) ->
    # console.log("[REQUEST] data for pID", $rootScope.pID)
    $http.get(API_URL + "/api/data",
      params:
        pID: $rootScope.pID
        sample: true
    ).success((data) ->
      # console.log("[DATA] datasets:", data)
      callback(data.datasets)
    )

angular.module('diveApp.services').factory "UserService", ($http, $rootScope, $cookieStore, $window, API_URL) ->

  loginUser: (userName, password, callback) ->
    $http.get(API_URL + "/login",
      params:
        userName: userName
        password: password
    ).success((data) ->
      if (data['success'] == 1)
        $window.localStorage['userName'] = data['user']['userName']
        $window.localStorage['displayName'] = data['user']['displayName']
        # now = new Date()
        # expire = new Date(now.valueOf() + 10 * 1000)
        expire = new Date()
        expire.setDate(expire.getDate() + 1)
        $window.localStorage['expiration'] = expire.valueOf()
      callback(data)
    )

  logoutUser: (callback) ->
    $window.localStorage.clear()
    if (callback)
      callback()

  registerUser: (userName, displayName, password, callback) ->
    $http.post(API_URL + "/register",
      params:
        userName: userName
        displayName: displayName
        password: password
    ).success((data) ->
      if (data['success'] == 1)
        # $cookieStore.put('user', data)
        $window.localStorage['userName'] = data['user']['userName']
        $window.localStorage['displayName'] = data['user']['displayName']
      callback(data)
    )
  
  getCurrentUser : (init) ->
    expire = $window.localStorage['expiration']
    if (init and expire)
      now = new Date()
      if (now > expire)      
        $window.localStorage.clear()

    {"userName" : $window.localStorage['userName'], "displayName" : $window.localStorage['displayName'] }


angular.module('diveApp.services').factory "PropertyService", ($http, $rootScope, API_URL) ->
  getProperties: (callback) ->
    # console.log("[REQUEST] properties for pID", $rootScope.pID)
    $http.get(API_URL + "/api/property",
      params:
        pID: $rootScope.pID
    ).success((data) ->
      # console.log("[DATA] properties:", data)
      callback(data)
    )
  updateProperties: (ontologies, callback) ->
    # console.log("[UPDATE] properties for pID", $rootScope.pID)
    $http.put(API_URL + "/api/property",
      params:
        pID: $rootScope.pID
        ontologies: ontologies
    ).success((data) ->
      # console.log("[DATA] properties:", data)
      callback(data)
    )

angular.module('diveApp.services').service "SpecificationService", ($http, $rootScope, API_URL) ->
  promise: (callback) ->
    # console.log("[REQUEST] specifications for pID", $rootScope.pID)
    $http.get(API_URL + "/api/specification",
      params:
        pID: $rootScope.pID
    ).success((data) ->
      # console.log("[DATA] specifications:", data)
      callback(data)
    )

angular.module('diveApp.services').service "ConditionalDataService", ($http, $rootScope, API_URL) ->
  # TODO Generalize service for other vizTypes
  promise: (dID, spec, callback) ->
    # console.log('[REQUEST] Conditional Data for Type', type, 'and Specification ', spec)
    $http.get(API_URL + "/api/conditional_data",
      params:
        pID: $rootScope.pID
        dID: dID
        spec: spec
    ).success((data) ->
      console.log("[DATA] Conditional Data:", data)
      callback(data)
    )

angular.module('diveApp.services').service "VizDataService", ($http, $rootScope, API_URL) ->
  # TODO Generalize service for other vizTypes
  promise: (params, callback) ->
    unless params.pID then params.pID = $rootScope.pID
    console.log('[REQUEST] Viz Data for Type', params.type, 'and Specification ', params.spec)
    $http.get(API_URL + "/api/visualization_data",
      params: params
    ).success((data) ->
      callback(data)
    )

angular.module('diveApp.services').service "ExportedVizSpecService", ($http, $rootScope, API_URL) ->
  # TODO Generalize service for other vizTypes
  promise: (params, callback) ->
    unless params.pID then params.pID = $rootScope.pID
    $http.get(API_URL + "/api/exported_spec",
      params: params
    ).success((data) ->
      # console.log("[DATA] Viz Data:", data)
      callback(data)
    )

# angular.module('diveApp.services').service "ExportedVizDataService", ["API_URL", ($http, $rootScope, API_URL) ->
#   # TODO Generalize service for other vizTypes
#   promise: (type, spec, conditional, callback) ->
#     # console.log('[REQUEST] Viz Data for Type', type, 'and Specification ', spec)
#     $http.get(API_URL + "/api/visualization_data",
#       params:
#         pID: $rootScope.pID
#         type: type
#         spec: spec
#         conditional: conditional
#     ).success((data) ->
#       # console.log("[DATA] Viz Data:", data)
#       callback(data)
#     )