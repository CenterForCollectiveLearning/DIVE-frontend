require('angular');
require('ng-file-upload');

angular.module('diveApp.data', ['diveApp.services', 'ngFileUpload']);

require('./data.ctrl');
require('../base/datatable.directive');
