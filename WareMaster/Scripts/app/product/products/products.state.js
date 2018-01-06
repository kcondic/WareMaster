angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('products',
            {
                url: '/products',
                controller: 'ProductsController',
                templateUrl: '/Scripts/app/products/products.template.html'
            });
});