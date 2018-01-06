angular.module('app').controller('EditEmployeeController',
    function($scope, $state, $stateParams, employeesRepository, functionsRepository, loginRepository, activitylogRepository) {

        employeesRepository.getEmployeeToEdit($stateParams.id).then(function(employee) {
            $scope.employeeToEdit = employee.data;
            $scope.firstName = $scope.employeeToEdit.FirstName;
            $scope.lastName = $scope.employeeToEdit.LastName;
        });

        $scope.editEmployee = function() {
            $scope.employeeToEdit.FirstName = $scope.firstName;
            $scope.employeeToEdit.LastName = $scope.lastName;
            employeesRepository.editEmployee($scope.employeeToEdit).then(
                function () {
                    activitylogRepository.addActivityLog({
                        Text: `${loginRepository.getManagerName()} je uredio zaposlenika ${$scope.employeeToEdit.FirstName} ${$scope.employeeToEdit.LastName}`,
                        UserId: loginRepository.getManagerId(),
                        CompanyId: loginRepository.getCompanyId()
                    });
                    functionsRepository.uploadEmployeeImage($scope.file, $scope.firstName,
                        $scope.lastName, $scope.employeeToEdit.Id, $scope.employeeToEdit.CompanyId);
                    $state.go('employees', {}, { reload: true });
                });
        }
    });