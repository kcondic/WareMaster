angular.module('app').controller('DashboardController',
    function ($scope, $state, loginRepository, activitylogRepository) {
        const companyId = loginRepository.getCompanyId();
        activitylogRepository.getActivityLogs(companyId).then(function(activitylogs) {
            $scope.ActivityLogs = activitylogs.data;
        });
    });