angular.module('app').controller('DashboardController',
    function ($scope, $rootScope, $state, dashboardRepository) {
        dashboardRepository.getActivities();

        $rootScope.headerdisplayed = true;
        $rootScope.displaysubheader = false;
    });