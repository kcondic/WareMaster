angular.module('app').controller('DashboardController',
    function ($scope, $rootScope, $state, dashboardRepository) {
        dashboardRepository.getActivities();

        $rootScope.currentTemplate = 'dashboard';

    });