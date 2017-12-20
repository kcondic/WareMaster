angular.module('app').controller('EditEmployeeController',
    function ($scope, $state, $stateParams, employeesRepository) {

        employeesRepository.getEmployeeToEdit($stateParams.id).then(function(employee) {
            $scope.employeeToEdit = employee.data;
            console.log($scope.employeeToEdit);
            $scope.firstName = $scope.employeeToEdit.FirstName;
            $scope.lastName = $scope.employeeToEdit.LastName;
        });

        $scope.editEmployee = function () {
            $scope.employeeToEdit.FirstName = $scope.firstName;
            $scope.employeeToEdit.LastName = $scope.lastName;
            console.log($scope.employeeToEdit);
            employeesRepository.editEmployee($scope.employeeToEdit).then(function () {
                $state.go('employees', {}, { reload: true });
            });
        }
    });