require 'angular'
require 'angular-local-storage'
_ = require('underscore')

angular.module 'diveApp.services', [ 'ui.router' ]

# Every service corresponds to a single type of entity (and all actions on it) or an atomic action

angular.module('diveApp.services').service 'ProjectService', ($http, API_URL) ->
  return {
    getProjects: (params) ->
      console.log 'Getting Datasets with params:', params
      return $http.get(API_URL + '/api/project', {
        params:
          user_name: params.userName
      }).then (r) ->
        return r.data

    createProjectTitleId: (params) ->
      _upperprojectTitleIdLimit = 999999
      _lowerprojectTitleIdLimit = 100000
      return Math.floor(Math.random() * (_upperprojectTitleIdLimit - _lowerprojectTitleIdLimit)) + _lowerprojectTitleIdLimit

    createProject: (params) ->
      if params.anonymous
        params.description = null

      return $http(
        method: 'POST'
        url: API_URL + '/api/project'
        data: params
        transformRequest: objectToQueryString
        headers:
          'Content-Type': 'application/x-www-form-urlencoded'
      ).success((response) ->
        return response
      ).error (data, status) ->
        console.log 'Error creating project:'
        console.log data
        console.log status
        return
  }

angular.module('diveApp.services').service 'ProjectIDService', ($http, $stateParams, $rootScope, API_URL) ->
  return {
    getProjectID: (params) ->
      if params and params.userName
        userName = params.userName
      else
        userName = ''

      return $http.get(API_URL + '/api/getProjectID', {
        params:
          user_name: userName
          formattedProjectTitle: params.formattedProjectTitle
      }).then((r) ->
        return r.data
      ).catch (r) ->
        console.error 'Error getting projectID', r.data, r.status
        return
  }

angular.module('diveApp.services').service('DataService', ($http, $rootScope, $q, API_URL) ->
  return { 
    getDatasets: (params) ->
      q = $q.defer()

      $http.get(API_URL + '/api/datasets', {
        params:
          pID: $rootScope.pID
          getStructure: params?.getStructure
      }).then (r) =>
        q.resolve(r.data.datasets)

      return q.promise

    getDataset: (dID) ->
      q = $q.defer()
      console.log 'dID'
      console.log dID
      
      $http.get(API_URL + "/api/datasets/#{dID}", {
        params:
          pID: $rootScope.pID
      }).then (r) =>
        q.resolve(r.data)

      return q.promise
  }
)

angular.module('diveApp.services').service('PreloadedDataService', ($http, API_URL) ->
  return {
    getPreloadedDatasets: (params, callback) ->
      return $http.get(API_URL + '/api/public_data', {
        params:
          sample: true
      }).then (r) ->
        callback r.data.datasets
        return
  }
)

angular.module('diveApp.services').factory 'AuthService', ($http, $rootScope, localStorageService, API_URL) ->
  return {
    # DO THIS CORRECTLY
    isAuthenticated: ->
      expire = localStorageService.get('expiration')
      if expire
        now = new Date
        if now < expire
          return true
        else
          localStorageService.clearAll()
      return false

    loginUser: (userName, password, callback) ->
      return $http.get(API_URL + '/api/login', {
        params:
          userName: userName
          password: password
      }).success (data) ->
        if data['success']
          localStorageService.set 'userName', data.user.userName
          localStorageService.set 'displayName', data.user.displayName

          expire = new Date
          expire.setDate expire.getDate() + 1
          localStorageService.set 'expiration', expire.valueOf()

          $rootScope.loggedIn = true
          $rootScope.user = data.user
        return callback(data)

    logoutUser: (callback) ->
      localStorageService.clearAll()
      $rootScope.loggedIn = false
      $rootScope.user = null

      if callback
        return callback()
      return

    registerUser: (userName, displayName, password, callback) ->
      $http.post(API_URL + '/api/register',
        params:
          userName: userName
          displayName: displayName
          password: password
      ).success (data) ->
        if data['success']
          $rootScope.loggedIn = true
          $rootScope.user = data.user

          localStorageService.set('userName', data.user.userName)
          localStorageService.set('displayName', data.user.displayName)
        return callback(data)

    getCurrentUser: ->
      expire = localStorageService.get('expiration')
      if expire
        now = new Date
        if now > expire
          localStorageService.clearAll()

      return {
        'userName': localStorageService.get('userName')
        'displayName': localStorageService.get('displayName')
      }

  }

angular.module('diveApp.services').service('PropertiesService', ($http, $rootScope, $q, API_URL) ->
  return {
    getProperties: (params, callback) ->
      q = $q.defer()
      $http.get(API_URL + '/api/properties/v1/properties', {
        params:
          pID: $rootScope.pID
          dID: params.dID
      }).then (r) ->
        q.resolve(r.data.properties)
      return q.promise

    getEntities: (params, callback) ->
      q = $q.defer()
      $http.get(API_URL + '/api/properties/v1/entities', {
        params:
          pID: $rootScope.pID
          dID: params.dID
      }).then (r) ->
        q.resolve(r.data.entities)
      return q.promise

    getAttributes: (params, callback) ->
      q = $q.defer()
      $http.get(API_URL + '/api/properties/v1/attributes', {
        params:
          pID: $rootScope.pID
          dID: params.dID
      }).then (r) ->
        q.resolve(r.data.attributes)
      return q.promise

  }
)

angular.module('diveApp.services').service 'SpecificationService', ($http, API_URL) ->
  return {
    getSpecifications: (params, callback) ->
      console.log 'Getting specifications with params', params
      $http.get(API_URL + '/api/specification', {
        params:
          pID: params.pID
      }).then (r) ->
        console.log 'Got specs', r.data
        return callback(r.data)
  }

angular.module('diveApp.services').service 'ConditionalDataService', ($http, API_URL) ->
  return {
    getConditionalData: (params, callback) ->
      console.log 'Getting conditional data, pID:', params
      delete params.spec.stats
      return $http.get(API_URL + '/api/conditional_data', {
        params:
          pID: params.pID
          dID: params.dID
          spec: params.spec
      }).then (r) ->
        return callback(r.data)
  }

angular.module('diveApp.services').service('VisualizationDataService', ($http, $rootScope, $q, API_URL) ->
  return {
    getVisualizationData: (params) ->
      q = $q.defer()

      # Remove stats field, which can be huge, from params
      console.log 'Getting viz data with params:', params
      $http.post(API_URL + '/api/data_from_spec', {
        pID: $rootScope.pID,
        spec: params.spec,
        conditional: params.conditional
      }).then (r) =>
        q.resolve(r.data)

      return q.promise
  }
)

angular.module('diveApp.services').service('StatisticsDataService', ($http, $rootScope, $q, API_URL) ->
  return {
    getStatisticsData: (params) ->
      q = $q.defer()

      console.log('Getting statistics with params:', params)
      $http.post(API_URL + '/api/statistics_from_spec', {
        pID: $rootScope.pID,
        spec: params.spec,
      }).then (r) =>
        q.resolve(r.data)

      return q.promise
  }
)

angular.module('diveApp.services').service('ExportedVizSpecService', ($http, API_URL) ->
  return {
    getExportedVizData: (params, callback) ->
      if !params.pID
        params.pID = $rootScope.pID
      return $http.get(API_URL + '/api/exported_spec', {params: params}).then (data) ->
        return callback(data)

    exportVizSpec: (params, callback) ->
      return $http.post(API_URL + '/api/exported_spec', {params: params}).then (data) ->
        return callback(data)
  }
)
