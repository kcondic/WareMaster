angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('orderdetails',
            {
                parent: 'orders',
                url: '/details/:id',
                controller: 'OrderDetailsController',
                templateUrl: '/Scripts/app/order/orderdetails/orderdetails.template.html'
            });
});