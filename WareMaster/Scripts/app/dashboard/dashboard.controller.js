angular.module('app').controller('DashboardController',
    function ($scope, $state, dashboardRepository, loginRepository) {
        const companyId = loginRepository.getCompanyId();
        dashboardRepository.getActivities(companyId);
    });