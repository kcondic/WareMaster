angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('dashboard',
            {
                url: '/dashboard',
                controller: 'DashboardController',
                templateUrl: '/Scripts/app/dashboard/dashboard.template.html',
                data: {
                    requiresLogin: true
                }
            });
});