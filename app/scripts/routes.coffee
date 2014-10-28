angular.module('diveApp.routes', ['ui.router']).config(($stateProvider, $urlRouterProvider) ->

  $urlRouterProvider.otherwise("/")

  $stateProvider
    .state('landing',
      url: '/'
      templateUrl: 'modules/landing/landing.html'
#      resolve:
#        allProjectsService: (AllProjectsService) -> AllProjectsService.promise
    )
    .state('embed',
      url: '/embed/:visualizationID'
      templateUrl: 'modules/views/embed.html'
      controller: 'EmbedCtrl'
      resolve:
        embedVizDataService: (EmbedVizDataService) -> EmbedVizDataService.promise
    )
    .state('engine',
      url: '/:formattedUserName/:formattedProjectTitle'
      templateUrl: 'modules/project/project.html'
      controller: ($scope, $state, $stateParams) ->
        $scope.projectTitle = $stateParams.formattedProjectTitle.split('-').join(' ')

        # TODO Only redirect if exact URL match
        # $state.go('engine.overview')
      resolve:
        formattedUserName: ($stateParams) -> $stateParams.formattedUserName
        formattedProjectTitle: ($stateParams) -> $stateParams.formattedProjectTitle
        projectID: ($stateParams, ProjectIDService) -> ProjectIDService.promise($stateParams.formattedProjectTitle)
    )
    .state('engine.overview'
      url: '/overview'
      templateUrl: 'modules/project/project_overview.html'
      controller: 'OverviewCtrl'
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
        propertyService: (PropertyService) -> PropertyService.promise
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
    )
  )
