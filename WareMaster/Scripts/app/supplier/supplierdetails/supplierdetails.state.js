angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('supplierdetails',
            {
                parent: 'suppliers',
                url: '/details/:id',
                controller: 'SupplierDetailsController',
                templateUrl: '/Scripts/app/supplierdetails/supplierdetails.template.html'
            });
});