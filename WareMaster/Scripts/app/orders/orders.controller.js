angular.module('app').controller('OrdersController',
    function ($scope, $state, ordersRepository, loginRepository, activitylogRepository) {

        const companyId = loginRepository.getCompanyId();

        ordersRepository.getAllOrders(companyId).then(function (orders) {
            $scope.allOrders = orders.data;
        });

        $scope.deleteOrder = function (id) {
            if (confirm(`Jeste li sigurni da želite otkazati narudžbu?`)) {
                ordersRepository.deleteOrder(id).then(function () {
                    activitylogRepository.addActivityLog({
                        Text: `${loginRepository.getManagerName()} je izbrisao narudžbu`,
                        UserId: loginRepository.getManagerId(),
                        CompanyId: companyId
                    });
                    $scope.allOrders.splice($scope.allOrders.findIndex(order => order.Id === id), 1);
                });
            }
        }
    });