angular.module('app').controller('AddEmployeeController',
    function ($scope, $state, employeesRepository) {

        $scope.addNewEmployee = function () {
            const newEmployee = {
                FirstName: $scope.firstName,
                LastName: $scope.lastName,
                Role: 0
            };
            employeesRepository.addEmployee(newEmployee).then(function () {
                $state.go('employees', {}, { reload: true });
            });
        }
    });