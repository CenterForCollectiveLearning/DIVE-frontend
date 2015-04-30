require('angular');
require('angular-local-storage');

angular.module('diveApp.services', ['ui.router']);

// Every service corresponds to a single type of entity (and all actions on it) or an atomic action

// angular.module('diveApp.services').service('ProjectsService', function($http, $scope, API_URL) {
//   return {
//     getProjects: function(params) {
//       console.log("GETTING PROJECTS", $scope.user)
//       return $http.get(API_URL + '/api/project', {
//         params: {
//           user_name: $scope.user
//         }
//       }).then(function(r) {
//         console.log("GOT PROJECTS", r)
//         return r.data;
//       });
//     }
//   };
// });

angular.module('diveApp.services').service('ProjectService', function($http, API_URL) {
  return {
    getProjects: function(params) {
      console.log("Getting Datasets with params:", params);
      return $http.get(API_URL + '/api/project', {
        params: {
          user_name: params.userName
        }
      }).then(function(r) {
        return r.data;
      });
    }
  };
});


angular.module('diveApp.services').service("ProjectIDService", function($http, $stateParams, $rootScope, API_URL) {
  return {
    getProjectID: function(formattedProjectTitle, userName) {
      console.log("Getting Project ID");
      return $http.get(API_URL + "/api/getProjectID", {
        params: {
          user_name: userName,
          formattedProjectTitle: formattedProjectTitle
        }
      }).then(function(r) {
        var pID = r.data;
        return pID;
      }).catch(function(r) {
        console.error("Error getting projectID", r.data, r.status);
      }).finally(function() {
        console.log("Got projectID");
      });
    }
  };
});

angular.module('diveApp.services').service("DataService", function($http, $rootScope, API_URL) {
  return {
    getDatasets: function(params) {
      console.log("Getting Datasets with params:", params);
      return $http.get(API_URL + "/api/data", {
        params: {
          pID: params.pID,
          sample: true
        }
      }).then(function(r) {
        return r.data.datasets;
      });
    }
  };
});

angular.module('diveApp.services').service("PublicDataService", function($http, API_URL) {
  return {
    getPublicDatasets: function(params) {
      return $http.get(API_URL + "/api/public_data", {
        params: {
          sample: true
        }
      }).then(function(r) {
        return r.data.datasets;
      });
      // if (method === 'GET') {
      //   return $http.get(API_URL + "/api/public_data", {
      //     params: {
      //       sample: true
      //     }
      //   }).then(function(data) {
      //     return callback(data.datasets);
      //   });
      // } else if (method === 'POST') {
      //   return $http.post(API_URL + "/api/public_data", params).then(function(data) {
      //     return callback(data.datasets);
      //   });
      // }
    }
  };
});


angular.module('diveApp.services').factory("AuthService", function($http, localStorageService, API_URL) {
  return {
    // DO THIS CORRECTLY
    isAuthenticated: function() {
      var expire = localStorageService.get('expiration');
      if (expire) {
        var now = new Date();
        if (now < expire) {
          return true;
        } else {
          localStorageService.clearAll();
        }
      }
      return false;
    },
    loginUser: function(userName, password, callback) {
      return $http.get(API_URL + "/api/login", {
        params: {
          userName: userName,
          password: password
        }
      }).success(function(data) {
        if (data['success']) {
          localStorageService.set('userName', data['user']['userName']);
          localStorageService.set('displayName', data['user']['displayName']);

          var expire = new Date();
          expire.setDate(expire.getDate() + 1);
          localStorageService.set('expiration', expire.valueOf());
        }
        return callback(data);
      });
    },
    logoutUser: function(callback) {
      $window.localStorage.clear();
      if (callback) {
        return callback();
      }
    },
    registerUser: function(userName, displayName, password, callback) {
      return $http.post(API_URL + "/api/register", {
        params: {
          userName: userName,
          displayName: displayName,
          password: password
        }
      }).success(function(data) {
        if (data['success']) {
          localStorageService.set('userName', data['user']['userName']);
          localStorageService.set('displayName', data['user']['displayName']);
        }
        return callback(data);
      });
    },
    getCurrentUser: function() {
      var expire = localStorageService.get('expiration');
      if (expire) {
        var now = new Date();
        if (now > expire) {
          localStorageService.clearAll();
        }
      }
      return {
        "userName": localStorageService.get('userName'),
        "displayName": localStorageService.get('displayName')
      };
    }
  };
});

angular.module('diveApp.services').factory("PropertyService", function($http, API_URL) {
  return {
    getProperties: function(params) {
      console.log("Getting properties with params", params);
      return $http.get(API_URL + "/api/property", {
        params: {
          pID: params.pID
        }
      }).then(function(r) {
        console.log("Got properties", r.data);
        return r.data;
      });
    },
    updateProperties: function(params) {
      return $http.put(API_URL + "/api/property", {
        params: {
          pID: params.pID,
          ontologies: params.ontologies
        }
      }).then(function(data) {
        return r.data
      });
    }
  };
});

angular.module('diveApp.services').service("SpecificationService", function($http, API_URL) {
  return {
    getSpecifications: function(params) {
      console.log("Getting specifications with params", params);
      return $http.get(API_URL + "/api/specification", {
        params: {
          pID: params.pID
        }
      }).then(function(r) {
        console.log("Got specs", r.data);
        return r.data;
      });
    }
  };
});

angular.module('diveApp.services').service("ConditionalDataService", function($http, API_URL) {
  return {
    promise: function(dID, spec, callback) {
      console.log("GETTING CONDTIONAL DATA WITH SPEC", spec);
      delete spec.stats;
      return $http.get(API_URL + "/api/conditional_data", {
        params: {
          pID: $rootScope.pID,
          dID: dID,
          spec: spec
        }
      }).then(function(data) {
        return r.data;
      });
    }
  };
});

angular.module('diveApp.services').service("VizDataService", function($http, API_URL) {
  return {
    promise: function(params) {
      return $http.get(API_URL + "/api/visualization_data", {
        params: params
      }).then(function(result) {
        return r.data;
      });
    }
  };
});

angular.module('diveApp.services').service("ExportedVizSpecService", function($http, API_URL) {
  return {
    promise: function(params, callback) {
      if (!params.pID) {
        params.pID = $rootScope.pID;
      }
      return $http.get(API_URL + "/api/exported_spec", {
        params: params
      }).then(function(data) {
        return callback(data);
      });
    }
  };
});