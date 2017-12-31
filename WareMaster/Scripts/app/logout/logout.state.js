angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('logout',
            {
                url: '/logout',
                controller: 'LogoutController'
            });
});