angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('register',
            {
                url: '/register',
                controller: 'RegisterController',
                templateUrl: '/Scripts/app/account/register/register.template.html'
            });
});