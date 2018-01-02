angular.module('app').controller('OrderDetailsController',
    function ($scope, $state, $stateParams, ordersRepository) {

        ordersRepository.getOrder($stateParams.id).then(function (order) {
            $scope.order = order.data;
        });
    });