angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('signin',
            {
                url: '/',
                controller: 'SigninController',
                templateUrl: '/Scripts/app/signin/signin.template.html',
            });
});