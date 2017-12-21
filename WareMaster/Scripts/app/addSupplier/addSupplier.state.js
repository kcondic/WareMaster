angular.module('app').config(function ($stateProvider) {
    $stateProvider
            .state('addsupplier',
                {
                    parent: 'suppliers',
                    url: '/add',
                    controller: 'AddSupplierController',
                    templateUrl: '/Scripts/app/addSupplier/addSupplier.template.html'
                    });
    });