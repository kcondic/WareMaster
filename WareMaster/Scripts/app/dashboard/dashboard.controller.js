angular.module('app').controller('DashboardController',
    function ($scope, $state, dashboardRepository, loginRepository, $rootScope) {
        const companyId = loginRepository.getCompanyId();
        dashboardRepository.getActivities(companyId);

        const authDetails = loginRepository.getAuthDetails();
        if (authDetails) {
            console.log(authDetails.username);
            console.log(authDetails.companyname);
            $rootScope.userName = authDetails.username;
            $rootScope.companyName = authDetails.companyname;
        }
    });