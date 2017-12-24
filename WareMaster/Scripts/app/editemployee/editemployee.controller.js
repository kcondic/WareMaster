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
            functionsRepository.uploadImage($scope.file, $scope.firstName, $scope.lastName);
            employeesRepository.editEmployee($scope.employeeToEdit).then(
                function() {
                    $state.go('employees', {}, { reload: true });
                });
        }
    });