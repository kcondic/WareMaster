angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('suppliers',
            {
                url: '/suppliers',
                controller: 'SuppliersController',
                templateUrl: '/Scripts/app/supplier/suppliers/suppliers.template.html'
            });
});