require('angular')
require('angular-ui-router')
require('angular-uuid')

angular.module('diveApp.routes',['ui.router', 'ngCookies', 'angular-uuid'])

angular.module('diveApp.routes').run ($rootScope, $state, $cookies, AuthService, uuid) ->
  $rootScope.$on '$stateChangeStart', (event, toState, toParams, fromState, fromParams) ->
    if toState.authenticate != false and !AuthService.isAuthenticated() and !$cookies._auid
      $cookies._auid = uuid.v4()

angular.module('diveApp.routes').config(($stateProvider, $urlRouterProvider, $locationProvider) ->
  $stateProvider
  .state('landing',
    url: '^/'
    templateUrl: 'modules/landing/landing.html'
    controller: ($scope, $rootScope, $state, $cookies, AuthService, user, loggedIn) ->
      $rootScope.user = user
      $rootScope.loggedIn = loggedIn
      savedTitle = $cookies._title

      if savedTitle
        $state.go 'project.data.upload', formattedProjectTitle: savedTitle
      else if loggedIn
        $state.go 'landing.create'
      else
        $state.go 'project.data.upload', formattedProjectTitle: null
      return

    resolve:
      user: (AuthService) ->
        AuthService.getCurrentUser()
      loggedIn: (AuthService) ->
        AuthService.isAuthenticated()
  )
    .state('landing.create',
      url: 'create'
      authenticate: true
      templateUrl: 'modules/landing/create.html'
      controller: 'CreateProjectCtrl'
    )
    .state('landing.projects',
      url: 'projects'
      authenticate: true
      templateUrl: 'modules/landing/projects.html'
      controller: 'ProjectListCtrl'
      resolve:
        projects: (ProjectService, AuthService) ->
          projects = ProjectService.getProjects(userName: AuthService.getCurrentUser().userName)
          console.log 'Projects', projects
          return projects
    )
    .state('landing.reports',
      url: 'reports'
      authenticate: true
      templateUrl: 'modules/landing/reports.html'
    )
    .state('landing.about',
      url: 'about'
      authenticate: true
      templateUrl: 'modules/landing/about.html'
    )
    .state('landing.login',
      url: 'login'
      authenticate: false
      controller: 'AuthenticateCtrl'
      templateUrl: 'modules/landing/login.html'
    )
    .state('landing.signup',
      url: 'signup'
      authenticate: false
      controller: 'AuthenticateCtrl'
      templateUrl: 'modules/landing/signup.html'
    )
  .state('logout',
    url: '/logout'
    controller: ($scope, $rootScope, $state, $stateParams, AuthService) ->
      AuthService.logoutUser ->
        $rootScope.user = null
        $rootScope.loggedIn = false
        $state.go 'landing.login'
        return
      return
  )
  .state('project',
    url: '/projects/:formattedProjectTitle'
    templateUrl: 'modules/project/project.html'
    controller: ($scope, $rootScope, $state, $stateParams, $q, $cookies, AuthService, ProjectIDService, ProjectService, user, loggedIn, projectParams, pIDRetrieved) ->
      if projectParams.refresh
        $state.go 'project.data.upload', formattedProjectTitle: projectParams.title
        return

      $scope.projectTitle = projectParams.title.split('-').join(' ')
      $rootScope.user = user
      $rootScope.loggedIn = loggedIn

      # TODO: should check for user permissions to this project
      # we should be able to mark whether this project is dirty or clean somehow

      setPID = (_pID) ->
        $rootScope.pID = _pID
        $scope.pID = _pID
        if !$scope.pID
          ProjectService.createProject(
            anonymous: true
            title: projectParams.title
            user_name: user.userName
          ).then (r) ->
            $cookies._title = projectParams.title
            $cookies._pID = r.data.pID
            $scope.pID = r.data.pID
            pIDRetrieved.q.resolve()
            return
        else
          $cookies._title = projectParams.title
          $cookies._pID = _pID
          pIDRetrieved.q.resolve()
        return

      if $cookies._pID
        setPID $cookies._pID
      else
        ProjectIDService.getProjectID(
          formattedProjectTitle: projectParams.title
          userName: user.userName
        ).then (_pID) ->
          setPID(_pID)
          return
      return

    resolve:
      user: (AuthService, $cookies) ->
        _authUser = AuthService.getCurrentUser()

        if _authUser and _authUser.userName
          _authUser.anonymous = false
          return _authUser

        if $cookies._auid
          return {
            anonymous: true
            userName: $cookies._auid
            id: $cookies._auid
          }

        return {
          anonymous: true
          userName: 'null'
          id: 'null'
        }

      loggedIn: (AuthService) ->
        AuthService.isAuthenticated()

      projectParams: ($state, $stateParams, ProjectService) ->
        title = ''
        if !$stateParams.formattedProjectTitle or $stateParams.formattedProjectTitle.length < 1
          title = ProjectService.createProjectTitleId()
          refresh = true
        else
          title = $stateParams.formattedProjectTitle
          refresh = false
        return {
          title: title
          refresh: refresh
        }

      pIDRetrieved: ($q) ->
        q = $q.defer()
        return {
          q: q
          promise: q.promise
        }

      datasetsListRetrieved: ($q) ->
        q = $q.defer()
        return {
          q: q
          promise: q.promise
        }

  ).state('project.overview',
    url: '/overview'
    templateUrl: 'modules/project/project_overview.html'
    controller: 'OverviewCtrl'
  ).state('project.data',
    abstract: true
    authenticate: true
    url: '/data'
    templateUrl: 'modules/data/data.html'
    controller: 'DataCtrl'
  )
    .state('project.data.upload',
      url: '/upload'
      templateUrl: 'modules/data/upload_datasets.html'
      controller: 'UploadCtrl'
    )
    .state('project.data.preloaded',
      url: '/preloaded'
      templateUrl: 'modules/data/preloaded_datasets.html'
      controller: 'PreloadedDataCtrl'
    )
    .state('project.data.inspect',
      url: '/:dID/inspect'
      templateUrl: 'modules/data/inspect_dataset.html'
      controller: 'InspectDataCtrl'
    )
  .state('project.visualize',
    url: '/visualize'
    authenticate: true
    templateUrl: 'modules/visualization/visualization.html'
    controller: 'VisualizationCtrl'
  )
  .state('project.export',
    url: '/export'
    authenticate: true
    templateUrl: 'modules/export/export.html'
    controller: 'ExportCtrl'
  )
  .state('project.ontology',
    url: '/ontology'
    templateUrl: 'modules/property/property.html'
    controller: 'OntologyEditorCtrl'
  )

  $urlRouterProvider.otherwise('/')
  $locationProvider.html5Mode(true)
)