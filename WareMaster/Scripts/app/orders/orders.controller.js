angular.module('app').controller('OrdersController',
    function ($scope, $state, ordersRepository) {
        ordersRepository.getAllOrders().then(function (orders) {
            $scope.allOrders = orders.data;
        });

        $scope.deleteOrder = function (id) {
            if (confirm(`Jeste li sigurni da želite otkazati narudžbu ${id}.?`)) {
                ordersRepository.deleteOrder(id);
                $scope.allOrders.splice($scope.allOrders
                    .findIndex(order => order.Id === id), 1);
            }
        }
    });