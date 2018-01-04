angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('registerexisting',
            {
                url: '/registerexisting',
                controller: 'RegisterExistingController',
                templateUrl: '/Scripts/app/registerexisting/registerexisting.template.html'
            });
});