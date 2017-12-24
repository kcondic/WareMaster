angular.module('app').controller('AddEmployeeController',
    function ($scope, $state, Upload, employeesRepository) {

        $scope.addNewEmployee = function() {
            const newEmployee = {
                FirstName: $scope.firstName,
                LastName: $scope.lastName,
                ImageUrl: '',
                Role: 0
            };
            $scope.uploadImage($scope.file);
            employeesRepository.addEmployee(newEmployee).then(function() {
                $state.go('employees', {}, { reload: true });
            });
        }

        $scope.uploadImage = function (file) {
            Upload.rename(file, $scope.firstName + $scope.lastName + '.jpg');
            Upload.upload({
                url: 'api/employees/upload',
                file: file
            });
        }
    });