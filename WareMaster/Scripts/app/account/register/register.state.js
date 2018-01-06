angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('register',
            {
                url: '/register',
                controller: 'RegisterController',
                templateUrl: '/Scripts/app/register/register.template.html'
            });
});