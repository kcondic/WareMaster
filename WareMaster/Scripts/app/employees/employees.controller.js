angular.module('app').controller('EmployeesController',
    function ($scope, $state, employeesRepository) {

        employeesRepository.getAllEmployees().then(function (employees) {
            $scope.allEmployees = employees.data;
        });

        $scope.deleteEmployee = function (id, firstName, lastName) {
            if (confirm(`Jeste li sigurni da želite izbrisati zaposlenika ${firstName} ${lastName}?`))
            {
                employeesRepository.deleteEmployee(id);
                $scope.allEmployees.splice($scope.allEmployees
                    .findIndex(employee => employee.Id === id), 1);
            }         
        }
    });