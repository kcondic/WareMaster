angular.module('app').controller('DashboardController',
    function ($scope, $state, dashboardRepository, loginRepository) {
        const authDetails = loginRepository.getAuthDetails();
        if (authDetails) {
            $scope.userName = authDetails.username;
            $scope.companyName = authDetails.companyname;
        }
        const companyId = loginRepository.getCompanyId();
        dashboardRepository.getActivities(companyId);
    });