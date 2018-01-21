angular.module('app').controller('EditEmployeeController',
    function($scope, $state, $stateParams, employeesRepository, functionsRepository, loginRepository, activitylogRepository) {

        const companyId = loginRepository.getCompanyId();

        employeesRepository.getEmployeeToEdit($stateParams.id, companyId).then(function(employee) {
            $scope.employeeToEdit = employee.data;
            $scope.firstName = $scope.employeeToEdit.FirstName;
            $scope.lastName = $scope.employeeToEdit.LastName;
        }, function () {
            console.log("Nemate dozvolu za pristup tim podacima");
        });

        $scope.editEmployee = function() {
            $scope.employeeToEdit.FirstName = $scope.firstName;
            $scope.employeeToEdit.LastName = $scope.lastName;
            employeesRepository.editEmployee($scope.employeeToEdit).then(
                function () {
                    activitylogRepository.addActivityLog({
                        Text: `${loginRepository.getManagerName()} je uredio zaposlenika ${$scope.employeeToEdit.FirstName} ${$scope.employeeToEdit.LastName}`,
                        UserId: loginRepository.getManagerId(),
                        CompanyId: companyId
                    });
                    functionsRepository.uploadEmployeeImage($scope.file, $scope.firstName,
                        $scope.lastName, $scope.employeeToEdit.Id, $scope.employeeToEdit.CompanyId);
                    $state.go('employees', {}, { reload: true });
                });
        }
    });