angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('suppliers',
            {
                url: '/suppliers',
                controller: 'SuppliersController',
                templateUrl: '/Scripts/app/suppliers/suppliers.template.html'
            });
});