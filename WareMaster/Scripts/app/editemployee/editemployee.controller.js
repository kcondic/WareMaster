angular.module('app').controller('EditEmployeeController',
    function($scope, $state, $stateParams, employeesRepository, functionsRepository) {

        employeesRepository.getEmployeeToEdit($stateParams.id).then(function(employee) {
            $scope.employeeToEdit = employee.data;
            $scope.firstName = $scope.employeeToEdit.FirstName;
            $scope.lastName = $scope.employeeToEdit.LastName;
        });

        $scope.editEmployee = function() {
            $scope.employeeToEdit.FirstName = $scope.firstName;
            $scope.employeeToEdit.LastName = $scope.lastName;
            $scope.employeeToEdit.Id = $scope.employeeToEdit.Id;
            employeesRepository.editEmployee($scope.employeeToEdit).then(
                function () {
                    functionsRepository.uploadImage($scope.file, $scope.firstName, $scope.lastName, $scope.employeeToEdit.Id);
                    $state.go('employees', {}, { reload: true });
                });
        }
    });