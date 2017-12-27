angular.module('app').controller('AddEmployeeController',
    function ($scope, $state, Upload, employeesRepository, functionsRepository) {

        $scope.addNewEmployee = function() {
            const newEmployee = {
                FirstName: $scope.firstName,
                LastName: $scope.lastName,
                ImageUrl: '',
                Role: 0
            };
            employeesRepository.addEmployee(newEmployee).then(function () {
                employeesRepository.getIdNeededForImageName().then(function(id) {
                    $scope.id = id.data;
                }).then(function() {
                    functionsRepository.uploadImage($scope.file, $scope.firstName, $scope.lastName, $scope.id);
                    $state.go('employees', {}, { reload: true });
                });
            });
        }
    });