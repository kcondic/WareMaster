angular.module('app').controller('DashboardController',
function ($scope, $rootScope, $state, loginRepository, functionsRepository) {

    $rootScope.currentTemplate = 'dashboard';
    $scope.activityLogs = [];
    let currentPosition = 0;
    const companyId = loginRepository.getCompanyId();

    function load() {
        functionsRepository.getTen('activitylogs', currentPosition, companyId).then(function (activityLogs) {
        $scope.activityLogs.push(...activityLogs.data);
        });
    }

    $scope.loadMore = function() {
        load();
        currentPosition += 20;
    }
});