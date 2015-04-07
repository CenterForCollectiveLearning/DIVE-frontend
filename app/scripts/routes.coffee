angular = require('angular')
require('angular-ui-router')

angular.module('diveApp.routes', ['ui.router']).config(($stateProvider, $urlRouterProvider, $locationProvider) ->

  $urlRouterProvider.otherwise("/")
  # $locationProvider.html5Mode(true)

  checkAuth = ($rootScope, $state, $stateParams, UserService, ProjectService, formattedUserName, projectID) ->
    user = UserService.getCurrentUser()

    if ((user.userName == formattedUserName) && ($rootScope.pID == projectID.data))
      ProjectService.promise($rootScope.pID, user.userName, (project) ->
        if project.length
          return
      )
    else
      UserService.logoutUser()
      $state.go('landing')

  $stateProvider
    .state('landing',
      url: '/'
      templateUrl: 'modules/landing/landing.html'
      # controller = ($state) ->
      #   $state.go('landing.create')
    )
    .state('landing.reports',
      url: 'reports',
      templateUrl: 'modules/landing/reports.html'      
    )
    .state('landing.projects',
      url: 'projects',
      templateUrl: 'modules/landing/projects.html'
    )
    .state('landing.create',
      url: 'create'
      templateUrl: 'modules/landing/create.html'
    )
    .state('landing.about',
      url: 'about'
      templateUrl: 'modules/landing/about.html'
    )
    .state('embed',
      url: '/embed/:pID/:sID'
      templateUrl: 'modules/embed/embed.html'
      controller: 'EmbedCtrl'
      resolve:
        vizDataService: (VizDataService) -> VizDataService.promise
        exportedVizSpecService: (ExportedVizSpecService) -> ExportedVizSpecService.promise
    )
    .state('project',
      url: '/:formattedUserName/:formattedProjectTitle'
      templateUrl: 'modules/project/project.html'
      onEnter: checkAuth
      controller: ($scope, $rootScope, $state, $stateParams, $window, UserService, ProjectService, projectID) ->
        $scope.projectTitle = $stateParams.formattedProjectTitle.split('-').join(' ')
        $scope.user = UserService.getCurrentUser()
        $scope.logoutUser = () ->
          UserService.logoutUser()
          $state.go('landing')

      resolve:
        formattedUserName: ($stateParams) -> $stateParams.formattedUserName
        formattedProjectTitle: ($stateParams) -> $stateParams.formattedProjectTitle
        projectID: ($stateParams, UserService, ProjectIDService) -> 
          ProjectIDService.promise($stateParams.formattedProjectTitle, UserService.getCurrentUser()['userName'])
    )
    .state('project.overview'
      url: '/overview'
      templateUrl: 'modules/project/project_overview.html'
      controller: 'OverviewCtrl',
    )
    .state('project.data'
      url: '/data'
      templateUrl: 'modules/data/data.html'
      controller: 'DatasetListCtrl'
      resolve:
        initialData: (DataService) -> DataService.promise
    )
    .state('project.ontology'
      url: '/ontology'
      templateUrl: 'modules/property/property.html'
      controller: 'OntologyEditorCtrl'
      resolve:
        initialData: (DataService) -> DataService.promise
        propertyService: (PropertyService) -> PropertyService.getProperties
    )
    .state('project.visualize'
      url: '/visualize'
      templateUrl: 'modules/visualization/visualization.html'
      controller: 'CreateVizCtrl'
      resolve:
        specificationService: (SpecificationService) -> SpecificationService.promise
        vizDataService: (VizDataService) -> VizDataService.promise
        conditionalDataService: (ConditionalDataService) -> ConditionalDataService.promise
    )
    .state('project.assemble'
      url: '/assemble'
      templateUrl: 'modules/export/export.html'
      controller: 'AssembleCtrl'
      resolve:
        vizDataService: (VizDataService) -> VizDataService.promise
        exportedVizSpecService: (ExportedVizSpecService) -> ExportedVizSpecService.promise
    )
  )
