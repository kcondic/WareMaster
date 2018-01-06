angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('login',
            {
                url: '/',
                controller: 'LoginController',
                templateUrl: '/Scripts/app/account/login/login.template.html'
            });
});