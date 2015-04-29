require('angular');
require('angular-ui-router');


angular.module('diveApp.routes', ['ui.router'])

// https://medium.com/@mattlanham/authentication-with-angularjs-4e927af3a15f
angular.module('diveApp.routes').run(function($rootScope, $state, AuthService) {
  $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {
    if (toState.authenticate && !AuthService.isAuthenticated()) {
      $state.transitionTo("landing.authenticate");
      event.preventDefault();
    }
  });
})

angular.module('diveApp.routes').config(function($stateProvider, $urlRouterProvider, $locationProvider) {  
  $stateProvider
  .state('landing', {
    url: '^/',
    templateUrl: 'modules/landing/landing.html',
    controller: function($scope, $state) {
      $state.go('landing.create');
    }
  })
    .state('landing.create', {
      url: 'create',
      authenticate: true,
      templateUrl: 'modules/landing/create.html',
      controller: 'CreateProjectCtrl'
    })
    .state('landing.projects', {
      url: 'projects',
      authenticate: true,
      templateUrl: 'modules/landing/projects.html',
      controller: 'ProjectListCtrl',
      resolve: {
        projects: function(ProjectService, AuthService) {
          var projects = ProjectService.getProjects({ username: AuthService.getCurrentUser().username });
          console.log("Projects", projects);
          return projects;
        }
      }
    })
    .state('landing.reports', {
      url: 'reports',
      authenticate: true,
      templateUrl: 'modules/landing/reports.html'
    })
    .state('landing.about', {
      url: 'about',
      authenticate: true,
      templateUrl: 'modules/landing/about.html'
    })
    .state('landing.authenticate', {
      url: 'authenticate',
      authenticate: false,
      controller: 'AuthenticateCtrl',
      templateUrl: 'modules/landing/authenticate.html'
    })

  .state('project', {
    url: '/:formattedUserName/:formattedProjectTitle',
    templateUrl: 'modules/project/project.html',
    controller: function($scope, $state, $stateParams, AuthService) { //function($scope, $rootScope, $state, $stateParams, $window, AuthService, projectID) {
      $scope.projectTitle = $stateParams.formattedProjectTitle.split('-').join(' ');
      $scope.user = AuthService.getCurrentUser();
      $scope.logoutUser = function() {
        AuthService.logoutUser();
        $state.go('landing');
      };
    },
    resolve: {
      formattedUserName: function($stateParams) {
        return $stateParams.formattedUserName;
      },
      formattedProjectTitle: function($stateParams) {
        return $stateParams.formattedProjectTitle;
      },
      projectID: function($stateParams, $rootScope, AuthService, ProjectIDService) {
        return ProjectIDService.getProjectID($stateParams.formattedProjectTitle, AuthService.getCurrentUser()['username']);
      }
    }
  })
  .state('project.overview', {
    url: '/overview',
    templateUrl: 'modules/project/project_overview.html',
    controller: 'OverviewCtrl'
  })
  .state('project.data', {
    abstract: true,
    authenticate: true,
    url: '/data',
    templateUrl: 'modules/data/data.html',
    controller: 'DataCtrl',
    resolve: {
      datasets: function(DataService, projectID) {
        return DataService.getDatasets({ pID: projectID });
      },

    }
  })
    .state('project.data.upload', {
      url: '/upload',
      templateUrl: 'modules/data/upload_datasets.html',
      controller: 'UploadCtrl'
    })
    .state('project.data.preloaded', {
      url: '/preloaded',
      templateUrl: 'modules/data/preloaded_datasets.html',
      controller: 'PreloadedDataCtrl',
      resolve: {
        preloadedDatasets: function(PublicDataService) {
          return PublicDataService.getPublicDatasets({});
        }
      }
    })
    .state('project.data.inspect', {
      url: '/inspect/:dID',
      templateUrl: 'modules/data/inspect_dataset.html',
      controller: 'InspectDataCtrl'
    })

  .state('project.visualize', {
    url: '/visualize',
    templateUrl: 'modules/visualization/visualization.html',
    controller: 'CreateVizCtrl',
    resolve: {
      specifications: function(SpecificationService) {
        return SpecificationService.getSpecifications({});
      },
      // vizDataService: function(VizDataService) {
      //   return VizDataService.promise;
      // },
      // conditionalDataService: function(ConditionalDataService) {
      //   return ConditionalDataService.promise;
      // }
    }
  })
  .state('project.assemble', {
    url: '/assemble',
    templateUrl: 'modules/export/export.html',
    controller: 'AssembleCtrl',
    resolve: {
      vizDataService: function(VizDataService) {
        return VizDataService.promise;
      },
      exportedVizSpecService: function(ExportedVizSpecService) {
        return ExportedVizSpecService.promise;
      }
    }
  })
  .state('project.ontology', {
    url: '/ontology',
    templateUrl: 'modules/property/property.html',
    controller: 'OntologyEditorCtrl',
    resolve: {
      // initialData: function(DataService) {
      //   return DataService.promise;
      // },
      propertyService: function(PropertyService) {
        return PropertyService.getProperties;
      }
    }
  });

  // .state('embed', {
  //   url: '/embed/:pID/:sID',
  //   templateUrl: 'modules/embed/embed.html',
  //   controller: 'EmbedCtrl',
  //   resolve: {
  //     vizDataService: function(VizDataService) {
  //       return VizDataService.promise;
  //     },
  //     exportedVizSpecService: function(ExportedVizSpecService) {
  //       return ExportedVizSpecService.promise;
  //     }
  //   }
  // })

  $urlRouterProvider.otherwise("/");
  $locationProvider.html5Mode(true);
});