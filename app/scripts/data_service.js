var angular, angularCookies, angularFileUpload, _;

angular = require('angular');

angularFileUpload = require('angular-file-upload');

_ = require('underscore');
angularCookies = require('angular-cookies');

angular.module('diveApp.services', ['ui.router', 'angularFileUpload', 'ngCookies']);

angular.module('diveApp.services').service("AllProjectsService", function($http, $rootScope, API_URL) {
  return {
    promise: function(userName, callback) {
      return $http.get(API_URL + '/api/project', {
        params: {
          user_name: userName
        }
      }).success(function(result) {
        return callback(result);
      });
    }
  };
});

angular.module('diveApp.services').service("ProjectIDService", function($http, $stateParams, $rootScope, API_URL) {
  return {
    promise: function(formattedProjectTitle, userName) {
      return $http.get(API_URL + "/api/getProjectID", {
        params: {
          user_name: userName,
          formattedProjectTitle: formattedProjectTitle
        }
      }).success(function(pID) {
        console.log("Result of ProjectIdService", pID)
        $rootScope.pID = pID;
      });
    }
  };
});

angular.module('diveApp.services').service("ProjectService", function($http, $stateParams, $rootScope, API_URL) {
  return {
    promise: function(pID, userName, callback) {
      return $http.get(API_URL + "/api/project", {
        params: {
          user_name: userName,
          pID: pID
        }
      }).success(callback);
    }
  };
});

angular.module('diveApp.services').service("DataService", function($http, $rootScope, API_URL) {
  return {
    promise: function(callback) {
      console.log("Calling DataService, pID:", $rootScope.pID)      
      return $http.get(API_URL + "/api/data", {
        params: {
          pID: $rootScope.pID,
          sample: true
        }
      }).success(function(data) {
        return callback(data.datasets);
      });
    }
  };
});

angular.module('diveApp.services').service("PublicDataService", function($http, API_URL) {
  return {
    promise: function(method, params, callback) {
      if (method === 'GET') {
        return $http.get(API_URL + "/api/public_data", {
          params: {
            sample: true
          }
        }).success(function(data) {
          return callback(data.datasets);
        });
      } else if (method === 'POST') {
        return $http.post(API_URL + "/api/public_data", params).success(function(data) {
          return callback(data.datasets);
        });
      }
    }
  };
});

angular.module('diveApp.services').factory("UserService", function($http, $rootScope, $cookieStore, $window, API_URL) {
  return {
    loginUser: function(userName, password, callback) {
      return $http.get(API_URL + "/api/login", {
        params: {
          userName: userName,
          password: password
        }
      }).success(function(data) {
        var expire;
        if (data['success'] === 1) {
          $window.localStorage['userName'] = data['user']['userName'];
          $window.localStorage['displayName'] = data['user']['displayName'];
          expire = new Date();
          expire.setDate(expire.getDate() + 1);
          $window.localStorage['expiration'] = expire.valueOf();
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
        if (data['success'] === 1) {
          $window.localStorage['userName'] = data['user']['userName'];
          $window.localStorage['displayName'] = data['user']['displayName'];
        }
        return callback(data);
      });
    },
    getCurrentUser: function(init) {
      var expire, now;
      expire = $window.localStorage['expiration'];
      if (init && expire) {
        now = new Date();
        if (now > expire) {
          $window.localStorage.clear();
        }
      }
      return {
        "userName": $window.localStorage['userName'],
        "displayName": $window.localStorage['displayName']
      };
    }
  };
});

angular.module('diveApp.services').factory("PropertyService", function($http, $rootScope, API_URL) {
  return {
    getProperties: function(callback) {
      $http.get(API_URL + "/api/property", {
        params: {
          pID: $rootScope.pID
        }
      }).success(function(data) {
        return callback(data);
      });
    },
    updateProperties: function(ontologies, callback) {
      return $http.put(API_URL + "/api/property", {
        params: {
          pID: $rootScope.pID,
          ontologies: ontologies
        }
      }).success(function(data) {
        return callback(data);
      });
    }
  };
});

angular.module('diveApp.services').service("SpecificationService", function($http, $rootScope, API_URL) {
  return {
    promise: function(callback) {
      return $http.get(API_URL + "/api/specification", {
        params: {
          pID: $rootScope.pID
        }
      }).success(function(data) {
        return callback(data);
      });
    }
  };
});

angular.module('diveApp.services').service("ConditionalDataService", function($http, $rootScope, API_URL) {
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
      }).success(function(data) {
        return callback(data);
      });
    }
  };
});

angular.module('diveApp.services').service("VizDataService", function($http, $rootScope, API_URL) {
  return {
    promise: function(params, callback) {
      if (!params.pID) {
        params.pID = $rootScope.pID;
      }
      return $http.get(API_URL + "/api/visualization_data", {
        params: params
      }).success(function(data) {
        console.log(data);
        return callback(data);
      });
    }
  };
});

angular.module('diveApp.services').service("ExportedVizSpecService", function($http, $rootScope, API_URL) {
  return {
    promise: function(params, callback) {
      if (!params.pID) {
        params.pID = $rootScope.pID;
      }
      return $http.get(API_URL + "/api/exported_spec", {
        params: params
      }).success(function(data) {
        return callback(data);
      });
    }
  };
});