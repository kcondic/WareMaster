angular.module('app').config(function ($stateProvider) {
    $stateProvider
            .state('addsupplier',
                {
                    parent: 'suppliers',
                    url: '/add',
                    controller: 'AddSupplierController',
                    templateUrl: '/Scripts/app/addsupplier/addsupplier.template.html'
                    });
    });