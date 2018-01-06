angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('login',
            {
                url: '/',
                controller: 'LoginController',
                templateUrl: '/Scripts/app/login/login.template.html'
            });
});