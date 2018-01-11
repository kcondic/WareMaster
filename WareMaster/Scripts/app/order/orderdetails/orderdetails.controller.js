angular.module('app').controller('OrderDetailsController',
    function ($scope, $state, $stateParams, ordersRepository, activitylogRepository, loginRepository) {
        
        const companyId = loginRepository.getCompanyId();

        ordersRepository.getOrderDetails($stateParams.id, companyId).then(function (order) {
            $scope.order = order.data;
            if($scope.order.Supplier)
                $scope.nameOfSupplier = $scope.order.Supplier.Name;
            if ($scope.order.AssignedEmployee)
                $scope.nameOfEmployee = $scope.order.AssignedEmployee.FirstName + ' ' + $scope.order.AssignedEmployee.LastName;
            else
                $scope.nameOfEmployee = 'Nije pridijeljen zaposlenik';
        }, function () {
            console.log("Unauthorised");
        });

        $scope.deleteOrder = function (id) {
            if (confirm(`Jeste li sigurni da želite otkazati narudžbu?`)) {
                ordersRepository.deleteOrder(id).then(function () {
                    activitylogRepository.addActivityLog({
                        Text: `${loginRepository.getManagerName()} je izbrisao narudžbu`,
                        UserId: loginRepository.getManagerId(),
                        CompanyId: companyId
                    });
                    $state.go('orders', {}, { reload: true });
                });
            }
        }
    });