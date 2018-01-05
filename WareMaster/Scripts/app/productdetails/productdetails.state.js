angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('productdetails',
            {
                parent: 'products',
                url: '/details/:id',
                controller: 'ProductDetailsController',
                templateUrl: '/Scripts/app/productdetails/productdetails.template.html'
            });
});