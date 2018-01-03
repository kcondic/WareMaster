angular.module('app').controller('AddEmployeeController',
    function ($scope, $state, employeesRepository, functionsRepository, loginRepository) {

        const companyId = loginRepository.getCompanyId();

        $scope.addNewEmployee = function() {
            const newEmployee = {
                FirstName: $scope.firstName,
                LastName: $scope.lastName,
                CompanyId: companyId,
                ImageUrl: '',
                Role: 0
            };
            employeesRepository.addEmployee(newEmployee).then(function () {
                employeesRepository.getIdNeededForImageName().then(function(id) {
                    $scope.id = id.data;
                }).then(function() {
                    functionsRepository.uploadEmployeeImage($scope.file, $scope.firstName, $scope.lastName, $scope.id, companyId);
                    $state.go('employees', {}, { reload: true });
                });
            });
        }
    });