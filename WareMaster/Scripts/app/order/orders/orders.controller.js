angular.module('app').controller('OrdersController',
function ($scope, $state, ordersRepository, $rootScope, loginRepository, functionsRepository) {

    $rootScope.currentTemplate = 'orders';
    $scope.orderType = 0;

    $scope.getClass = function (columnTitleIndex) {
        if ($scope.orderType === 0 && columnTitleIndex === 0 || $scope.orderType === 1 && columnTitleIndex === 1) {
            return 'selected';
        } else {
            return '';
        }
    }

    $scope.getOrderName = function (supplier, assignedEmployee) {
        if ($scope.orderType === 0) {
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

    ordersRepository.getAllOrders(companyId).then(function(allOrders) {
        $scope.allOrders = allOrders.data;
    });
});
