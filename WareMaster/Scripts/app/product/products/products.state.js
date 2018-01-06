angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('products',
            {
                url: '/products',
                controller: 'ProductsController',
                templateUrl: '/Scripts/app/product/products/products.template.html'
            });
});