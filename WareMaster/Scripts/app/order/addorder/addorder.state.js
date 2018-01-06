angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('addorder',
            {
                parent: 'orders',
                url: '/add',
                controller: 'AddOrderController',
                templateUrl: '/Scripts/app/order/addorder/addorder.template.html'
            });
});