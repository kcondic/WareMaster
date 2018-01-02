angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('orders',
            {
                url: '/orders',
                controller: 'OrdersController',
                templateUrl: '/Scripts/app/orders/orders.template.html'
            });
});