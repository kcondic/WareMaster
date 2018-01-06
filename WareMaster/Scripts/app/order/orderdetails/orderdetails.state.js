angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('orderdetails',
            {
                parent: 'orders',
                url: '/details/:id',
                controller: 'OrderDetailsController',
                templateUrl: '/Scripts/app/orderdetails/orderdetails.template.html'
            });
});