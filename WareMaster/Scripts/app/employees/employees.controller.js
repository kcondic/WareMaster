angular.module('app').controller('EmployeesController',
    function ($scope, $state, employeesRepository) {

        employeesRepository.getAllEmployees().then(function (employees) {
            $scope.allEmployees = employees.data;
        });
    });