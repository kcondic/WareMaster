angular.module('app').controller('DashboardController',
function ($scope, $rootScope, $state, loginRepository, activitylogRepository) {

        $rootScope.currentTemplate = 'dashboard';

        const companyId = loginRepository.getCompanyId();
        activitylogRepository.getActivityLogs(companyId).then(function(activitylogs) {
            $scope.ActivityLogs = activitylogs.data;
        });
    });