angular.module('app').controller('OrdersController',
    function ($scope, $state, ordersRepository, loginRepository) {

        const companyId = loginRepository.getCompanyId();

        ordersRepository.getAllOrders(companyId).then(function (orders) {
            $scope.allOrders = orders.data;
        });
    });