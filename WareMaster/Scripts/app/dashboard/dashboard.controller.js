angular.module('app').controller('DashboardController',
    function ($scope, $state, dashboardRepository) {
        dashboardRepository.getActivities();
    });