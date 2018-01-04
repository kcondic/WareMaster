angular.module('app').controller('OrdersController',
    function ($scope, $state, ordersRepository, $rootScope) {

        $rootScope.currentTemplate = 'orders';
        $scope.orderType = 0;

        $scope.getClass = function (columnTitleIndex) {
            if ($scope.orderType === 0 && columnTitleIndex===0 || $scope.orderType === 1 && columnTitleIndex===1) {
                return 'selected';
            } else {
                return '';
            }
        }

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