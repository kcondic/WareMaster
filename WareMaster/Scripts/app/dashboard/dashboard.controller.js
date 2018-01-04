angular.module('app').controller('DashboardController',
    function ($scope, $rootScope, $state, dashboardRepository, loginRepository) {
        dashboardRepository.getActivities();

        $rootScope.currentTemplate = 'dashboard';

        const companyId = loginRepository.getCompanyId();
        dashboardRepository.getActivities(companyId);
    });