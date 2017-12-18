angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('signin',
            {
                url: '/',
                templateUrl: '/Scripts/app/signin/signin.template.html'
            });
});