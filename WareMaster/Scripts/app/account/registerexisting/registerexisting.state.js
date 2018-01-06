angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('registerexisting',
            {
                url: '/registerexisting',
                controller: 'RegisterExistingController',
                templateUrl: '/Scripts/app/account/registerexisting/registerexisting.template.html'
            });
});