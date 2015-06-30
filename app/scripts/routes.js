require('angular');
require('angular-ui-router');

angular.module('diveApp.routes', ['ui.router', 'ngCookies'])

angular.module('diveApp.routes').config(function($stateProvider, $urlRouterProvider, $locationProvider) {  
  $stateProvider
  .state('landing', {
    url: '^/',
    templateUrl: 'modules/landing/landing.html',
    controller: function($scope, $rootScope, $state, $cookies, AuthService, user, loggedIn) {
      $rootScope.user = user;
      $rootScope.loggedIn = loggedIn;
      var savedTitle = $cookies._title;
      if (savedTitle)
        $state.go('project.data.upload', {
          formattedProjectTitle: savedTitle
        });
      else if (loggedIn)
        $state.go('landing.create');
      else
        $state.go('project.data.upload', {
          formattedProjectTitle: null
        });
    },
    resolve: {
      user: function(AuthService) {
        return AuthService.getCurrentUser();          
      },
      loggedIn: function(AuthService) {
        return AuthService.isAuthenticated();
      }
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
          var projects = ProjectService.getProjects({ userName: AuthService.getCurrentUser().userName });
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
    .state('landing.login', {
      url: 'login',
      authenticate: false,
      controller: 'AuthenticateCtrl',
      templateUrl: 'modules/landing/login.html'
    })
    .state('landing.signup', {
      url: 'signup',
      authenticate: false,
      controller: 'AuthenticateCtrl',
      templateUrl: 'modules/landing/signup.html'
    })
  .state('logout', {
    url: '/logout',
    controller: function($scope, $rootScope, $state, $stateParams, AuthService) {
      AuthService.logoutUser(function() {
        $rootScope.user = null;
        $rootScope.loggedIn = false;
        $state.go('landing.login');          
      });      
    }
  })
  .state('project', {
    url: '/projects/:formattedProjectTitle',
    templateUrl: 'modules/project/project.html',
    controller: function($scope, $rootScope, $state, $stateParams, $q, $cookies, AuthService, ProjectIDService, ProjectService, user, loggedIn, projectParams, pIDRetrieved) {
      if (projectParams.refresh) {
        $state.go('project.data.upload', {
          formattedProjectTitle: projectParams.title
        });
        return;
      }

      $scope.projectTitle = projectParams.title.split('-').join(' ');
      $rootScope.user = user;
      $rootScope.loggedIn = loggedIn;

      if (user && user.userName)
        userName = user.userName;
      else
        userName = "null";

      var params = {
        formattedProjectTitle: projectParams.title, 
        userName: userName
      };

      // TODO: should check for user permissions to this project
      // we should be able to mark whether this project is dirty or clean somehow
      var setPID = function (_pID) {
        $scope.pID = _pID;
        if (!$scope.pID)
          ProjectService.createProject({anonymous: true, title: projectParams.title}).then(function(r) {
            $cookies._title = projectParams.title;
            $cookies._pID = r.data.pID;
            $scope.pID = r.data.pID;
            pIDRetrieved.q.resolve();
          });
        else {
          $cookies._title = projectParams.title;
          $cookies._pID = _pID;
          pIDRetrieved.q.resolve();
        }        
      };

      if ($cookies._pID)
        setPID($cookies._pID);
      else
        ProjectIDService.getProjectID(params).then(function(_pID) {
          setPID(_pID);
        });

    },
    resolve: {
      user: function(AuthService) {
        return AuthService.getCurrentUser();          
      },
      loggedIn: function(AuthService) {
        return AuthService.isAuthenticated();
      },

      projectParams: function($state, $stateParams, ProjectService) {
        var title = '';
        if (!$stateParams.formattedProjectTitle || $stateParams.formattedProjectTitle.length < 1) {
          title = ProjectService.createProjectTitleId();
          refresh = true;
        } else {
          title = $stateParams.formattedProjectTitle;
          refresh = false;
        }

        return {
          title: title,
          refresh: refresh
        }
      },

      pIDRetrieved: function($q) {
        q = $q.defer();
        return {
          q: q,
          promise: q.promise
        };
      },

      datasetsRetrieved: function($q) {
        q = $q.defer();
        return {
          q: q,
          promise: q.promise
        };
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
    controller: 'DataCtrl'
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
    })
    .state('project.data.inspect', {
      url: '/:dID/inspect',
      templateUrl: 'modules/data/inspect_dataset.html',
      controller: 'InspectDataCtrl'
    })

  .state('project.visualize', {
    url: '/visualize',
    authenticate: true,
    templateUrl: 'modules/visualization/visualization.html',
    controller: 'VisualizationCtrl'
  })
  .state('project.export', {
    url: '/export',
    authenticate: true,
    templateUrl: 'modules/export/export.html',
    controller: 'ExportCtrl'
  })
  .state('project.ontology', {
    url: '/ontology',
    templateUrl: 'modules/property/property.html',
    controller: 'OntologyEditorCtrl',
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
