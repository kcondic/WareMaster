angular.module('app').controller('AddEmployeeController',
    function($scope, $state, employeesRepository, functionsRepository, loginRepository, activitylogRepository) {

        const companyId = loginRepository.getCompanyId();

        $scope.addNewEmployee = function() {
            const newEmployee = {
                FirstName: $scope.firstName,
                LastName: $scope.lastName,
                CompanyId: companyId,
                ImageUrl: '',
                Role: 0
            };
            employeesRepository.addEmployee(newEmployee).then(function (employeeToken) {
                alert(
                    `Da bi se zaposlenik mogao registrirati, mora upisati sljedeću riječ pri registraciji: ${employeeToken.data}`);
                activitylogRepository.addActivityLog({
                    Text: `${loginRepository.getManagerName()} je stvorio zaposlenika ${$scope.firstName} ${$scope.lastName}`,
                    UserId: loginRepository.getManagerId(),
                    CompanyId: companyId
                });
                $scope.id = parseInt(employeeToken.data.match(/\d+$/));
                functionsRepository.uploadEmployeeImage($scope.file, $scope.firstName, $scope.lastName, $scope.id, companyId);
                $state.go('employees', {}, { reload: true });
            });
        }
    });