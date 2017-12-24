angular.module('app').controller('OrdersController',
    function ($scope, $state, ordersRepository) {
        ordersRepository.getAllOrders().then(function (orders) {
            $scope.allOrders = orders.data;
        });
    });