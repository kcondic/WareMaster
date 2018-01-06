angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('addproduct',
            {
                parent: 'products',
                url: '/add',
                controller: 'AddProductController',
                templateUrl: '/Scripts/app/product/addproduct/addproduct.template.html'
            });
});