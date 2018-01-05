angular.module('app').controller('EmployeeDetailsController',
    function ($scope, $state, $stateParams, employeesRepository, activitylogRepository, loginRepository) {

        const companyId = loginRepository.getCompanyId();

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

        $scope.deleteEmployee = function (id, firstName, lastName) {
            if (confirm(`Jeste li sigurni da želite izbrisati zaposlenika ${firstName} ${lastName}?\nTime će njegovo ime i aktivnosti nestati iz sustava.`)) {
                employeesRepository.deleteEmployee(id);
                activitylogRepository.addActivityLog({
                    Text: `${loginRepository.getManagerName()} je izbrisao zaposlenika ${firstName} ${lastName}`,
                    UserId: loginRepository.getManagerId(),
                    CompanyId: companyId
                });
                setTimeout(function() { $state.go('employees', {}, { reload: true }) }, 50)};
            }
    });