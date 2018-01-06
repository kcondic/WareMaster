angular.module('app').controller('OrderDetailsController',
    function ($scope, $state, $stateParams, ordersRepository, activitylogRepository, loginRepository) {
        
        $scope.getName = function (orderType, supplier, assignedEmployee) {
            if (orderType === 0) {
                return supplier;
            } else {
                if (assignedEmployee === null) {
                    return 'Nije pridijeljen zaposlenik';
                } else {
                    $scope.nameOfEmployee = assignedEmployee.FirstName + ' ' + assignedEmployee.LastName;
                    return $scope.nameOfEmployee;
                }
            }
        }

        const companyId = loginRepository.getCompanyId();

        ordersRepository.getOrder($stateParams.id).then(function (order) {
            $scope.order = order.data;
        });

        $scope.deleteOrder = function (id) {
            if (confirm(`Jeste li sigurni da želite otkazati narudžbu?`)) {
                ordersRepository.deleteOrder(id).then(function () {
                    activitylogRepository.addActivityLog({
                        Text: `${loginRepository.getManagerName()} je izbrisao narudžbu`,
                        UserId: loginRepository.getManagerId(),
                        CompanyId: companyId
                    });
                    $state.go("orders", {}, { reload: true });
                });
            }
        }
    });