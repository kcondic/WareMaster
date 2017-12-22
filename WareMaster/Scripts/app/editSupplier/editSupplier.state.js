angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('editsupplier',
            {
                parent: 'suppliers',
                url: '/edit/:id',
                controller: 'EditSupplierController',
                templateUrl: '/Scripts/app/editsupplier/editsupplier.template.html'
            });
});