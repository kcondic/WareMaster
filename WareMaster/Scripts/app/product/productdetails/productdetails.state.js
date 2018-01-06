angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('productdetails',
            {
                parent: 'products',
                url: '/details/:id',
                controller: 'ProductDetailsController',
                templateUrl: '/Scripts/app/product/productdetails/productdetails.template.html'
            });
});