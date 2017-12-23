angular.module('app').controller('AddEmployeeController',
    function ($scope, $state, Upload, employeesRepository) {

        $scope.addNewEmployee = function() {
            const newEmployee = {
                FirstName: $scope.firstName,
                LastName: $scope.lastName,
                Image: $scope.uploadImage($scope.file),
                Role: 0
            };
            employeesRepository.addEmployee(newEmployee).then(function() {
                $state.go('employees', {}, { reload: true });
            });
        }

        $scope.uploadImage = function(file) {
            Upload.upload({
                data:{file: file}
            });
            return file;
        }
    });