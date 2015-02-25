angular = require('angular')
require('angular-ui-router')

angular.module('diveApp.routes', ['ui.router']).config(($stateProvider, $urlRouterProvider, $locationProvider) ->

  $urlRouterProvider.otherwise("/")
  # $locationProvider.html5Mode(true)

  checkAuth = ($rootScope, $state, $stateParams, UserService, ProjectService, formattedUserName, projectID) ->
    user = UserService.getCurrentUser()

    if ((user.userName == formattedUserName) && ($rootScope.pID == projectID.data))
      console.log("YES")
      console.log("User:", user.userName, "project:", $rootScope.pID)
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
#      resolve:
#        allProjectsService: (AllProjectsService) -> AllProjectsService.promise
    )
    .state('embed',
      url: '/embed/:pID/:sID'
      templateUrl: 'modules/embed/embed.html'
      controller: 'EmbedCtrl'
      resolve:
        vizDataService: (VizDataService) -> VizDataService.promise
        exportedVizSpecService: (ExportedVizSpecService) -> ExportedVizSpecService.promise
    )
    .state('engine',
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
    .state('engine.overview'
      url: '/overview'
      templateUrl: 'modules/project/project_overview.html'
      controller: 'OverviewCtrl',
    )
    .state('engine.data'
      url: '/data'
      templateUrl: 'modules/data/data.html'
      controller: 'DatasetListCtrl'
      resolve:
        initialData: (DataService) -> DataService.promise
    )
    .state('engine.ontology'
      url: '/ontology'
      templateUrl: 'modules/property/property.html'
      controller: 'OntologyEditorCtrl'
      resolve:
        initialData: (DataService) -> DataService.promise
        propertyService: (PropertyService) -> PropertyService.getProperties
    )
    .state('engine.visualize'
      url: '/visualize'
      templateUrl: 'modules/visualization/visualization.html'
      controller: 'CreateVizCtrl'
      resolve:
        specificationService: (SpecificationService) -> SpecificationService.promise
        vizDataService: (VizDataService) -> VizDataService.promise
        conditionalDataService: (ConditionalDataService) -> ConditionalDataService.promise
    )
    .state('engine.assemble'
      url: '/assemble'
      templateUrl: 'modules/export/export.html'
      controller: 'AssembleCtrl'
      resolve:
        vizDataService: (VizDataService) -> VizDataService.promise
        exportedVizSpecService: (ExportedVizSpecService) -> ExportedVizSpecService.promise
    )
  )
