require('angular');
require('angular-cookies');

angular.module('diveApp.services', ['ui.router', 'ngCookies']);

angular.module('diveApp.services').service("AllProjectsService", function($http, $rootScope, API_URL) {
  return {
    promise: function(userName, callback) {
      return $http.get(API_URL + '/api/project', {
        params: {
          user_name: userName
        }
      }).then(function(result) {
        return callback(result);
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

angular.module('diveApp.services').service("ProjectService", function($http, $stateParams, $rootScope, API_URL) {
  return {
    promise: function(pID, userName, callback) {
      return $http.get(API_URL + "/api/project", {
        params: {
          user_name: userName,
          pID: pID
        }
      }).then(callback);
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

angular.module('diveApp.services').factory("UserService", function($http, $rootScope, $cookieStore, $window, API_URL) {
  return {
    loginUser: function(userName, password, callback) {
      return $http.get(API_URL + "/api/login", {
        params: {
          userName: userName,
          password: password
        }
      }).then(function(data) {
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
      }).then(function(data) {
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
      }).then(function(data) {
        return callback(data);
      });
    },
    updateProperties: function(ontologies, callback) {
      return $http.put(API_URL + "/api/property", {
        params: {
          pID: $rootScope.pID,
          ontologies: ontologies
        }
      }).then(function(data) {
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
      }).then(function(r) {
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
      }).then(function(data) {
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
      }).then(function(data) {
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
      }).then(function(data) {
        return callback(data);
      });
    }
  };
});