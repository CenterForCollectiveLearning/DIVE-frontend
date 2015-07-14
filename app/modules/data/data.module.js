require('angular');
require('angular-file-upload');

angular.module('diveApp.data', ['diveApp.services', 'angularFileUpload']);

require('./data.ctrl');
require('../base/datatable.directive');
