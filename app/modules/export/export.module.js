var angular = require('angular');

angular.module('diveApp.export', ['diveApp.services']);

angular.module('diveApp.export').directive('exportSideNav', function() {
    return {
        restrict: 'E',
        templateUrl: 'modules/export/partials/side_nav.html',
        controller: 'ExportSideNavCtrl'
    };
});

// angular.module('diveApp.export').directive('assemblePreview', function() {
//     return {
//         restrict: 'E',
//         templateUrl: 'modules/export/partials/'
//     };
// });

require('./export.ctrl');
require('./export_preview.directive');