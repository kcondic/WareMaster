angular.module('app').controller('AddEmployeeController',
    function ($scope, $state, Upload, employeesRepository, functionsRepository) {

        $scope.addNewEmployee = function() {
            const newEmployee = {
                FirstName: $scope.firstName,
                LastName: $scope.lastName,
                ImageUrl: '',
                Role: 0
            };
            functionsRepository.uploadImage($scope.file,$scope.firstName,$scope.lastName);
            employeesRepository.addEmployee(newEmployee).then(function() {
                $state.go('employees', {}, { reload: true });
            });
        }
    });