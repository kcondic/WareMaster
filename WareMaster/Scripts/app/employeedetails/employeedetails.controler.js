angular.module('app').controller('EmployeeDetailsController',
    function ($scope, $state, $stateParams, employeesRepository) {

        employeesRepository.getEmployeeToEdit($stateParams.id).then(function(employee) {
            $scope.employee = employee.data;
            $scope.orders = $scope.employee.EmployeeOrders;
            $scope.chosenOrderFilter = "3";
        });

        $scope.updateOrderList = function () {
            if (parseInt($scope.chosenOrderFilter) === 3)
                $scope.orders = $scope.employee.EmployeeOrders;
            else
                $scope.orders = $scope.employee.EmployeeOrders.filter(function(order) {
                    return order.Status === parseInt($scope.chosenOrderFilter);
                });
        }
    });