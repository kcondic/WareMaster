angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('supplierdetails',
            {
                parent: 'suppliers',
                url: '/details/:id',
                controller: 'SupplierDetailsController',
                templateUrl: '/Scripts/app/supplier/supplierdetails/supplierdetails.template.html'
            });
});