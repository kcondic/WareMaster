angular.module('app').controller('AddEmployeeController',
    function ($scope, $state, Upload, employeesRepository, functionsRepository) {

        $scope.addNewEmployee = function() {
            const newEmployee = {
                FirstName: $scope.firstName,
                LastName: $scope.lastName,
                ImageUrl: '',
                Role: 0
            };
            employeesRepository.getIdNeededForImageName().then(function (id) {
                $scope.id = id.data;
            });
            employeesRepository.addEmployee(newEmployee).then(function () {
                functionsRepository.uploadImage($scope.file, $scope.firstName, $scope.lastName, $scope.id);
                $state.go('employees', {}, { reload: true });
            });
        }
    });