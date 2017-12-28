angular.module('app').controller('OrderDetailsController',
    function ($scope, $state, $stateParams, ordersRepository) {

        ordersRepository.getOrder($stateParams.id).then(function (order) {
            $scope.order = order.data;
            $scope.incomingOrder = $scope.order.Supplier === null ? false : true;
        });
    });