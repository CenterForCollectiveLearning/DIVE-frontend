diveApp.config(($stateProvider, $urlRouterProvider) ->
  $urlRouterProvider.otherwise("/")

  $stateProvider
    .state('landing',
      url: '/'
      templateUrl: 'static/views/landing.html'
      resolve:
        allProjectsService: (AllProjectsService) -> AllProjectsService.promise
    )
    .state('embed',
      url: '/embed/:visualizationID'
      templateUrl: 'static/views/embed.html'
      controller: 'EmbedCtrl'
      resolve:
        embedVizDataService: (EmbedVizDataService) -> EmbedVizDataService.promise
    )
    .state('engine',
      url: '/:formattedUserName/:formattedProjectTitle'
      templateUrl: 'static/views/project.html'
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
      templateUrl: 'static/views/project_overview.html'
      controller: 'OverviewCtrl'
    )
    .state('engine.data'
      url: '/data'
      templateUrl: 'static/views/data_view.html'
      controller: 'DatasetListCtrl'
      resolve:
        initialData: (DataService) -> DataService.promise
    )
    .state('engine.ontology'
      url: '/ontology'
      templateUrl: 'static/views/edit_ontology.html'
      controller: 'OntologyEditorCtrl'
      resolve:
        initialData: (DataService) -> DataService.promise
        propertyService: (PropertyService) -> PropertyService.promise
    )
    .state('engine.visualize'
      url: '/visualize'
      templateUrl: 'static/views/create_viz.html'
      controller: 'CreateVizCtrl'
      resolve:
        specificationService: (SpecificationService) -> SpecificationService.promise
        vizDataService: (VizDataService) -> VizDataService.promise
        conditionalDataService: (ConditionalDataService) -> ConditionalDataService.promise
    )
    .state('engine.assemble'
      url: '/assemble'
      templateUrl: 'static/views/assemble_engine.html'
      controller: 'AssembleCtrl'
    )
  )
