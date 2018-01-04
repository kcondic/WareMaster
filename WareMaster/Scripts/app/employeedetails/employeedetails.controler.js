angular.module('app').controller('EmployeeDetailsController',
    function ($scope, $state, $stateParams, employeesRepository) {

        employeesRepository.getEmployeeToEdit($stateParams.id).then(function(employee) {
            $scope.employee = employee.data;
        });
    });