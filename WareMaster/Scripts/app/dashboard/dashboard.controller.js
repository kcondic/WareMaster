angular.module('app').controller('DashboardController',
    function ($scope, $state, dashboardRepository, loginRepository, $rootScope) {
        const companyId = loginRepository.getCompanyId();
        dashboardRepository.getActivities(companyId);

        const authDetails = loginRepository.getAuthDetails();
        if (authDetails) {
            $rootScope.userName = authDetails.username;
            $rootScope.companyName = authDetails.companyname;
        }
    });