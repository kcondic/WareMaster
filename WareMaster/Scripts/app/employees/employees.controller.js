angular.module('app').controller('EmployeesController',
    function ($scope, $state, employeesRepository) {

        employeesRepository.getAllEmployees().then(function (employees) {
            $scope.allEmployees = employees.data;
        });

        $scope.deleteEmployee = function (id) {
            employeesRepository.deleteEmployee(id);
            $scope.allEmployees.splice($scope.allEmployees
                               .findIndex(employee => employee.Id === id), 1);
        }
    });