﻿angular.module('app').controller('EmployeesController',
    function ($scope, $state, employeesRepository, loginRepository, activitylogRepository) {

        const companyId = loginRepository.getCompanyId();

        employeesRepository.getAllEmployees(companyId).then(function (employees) {
            $scope.allEmployees = employees.data;

            for (let employee of $scope.allEmployees) {
                const random = (new Date()).toString();
                employee.ImageUrl = employee.ImageUrl + '?cb=' + random;
            }
        });

        $scope.deleteEmployee = function (id, firstName, lastName) {
            if (confirm(`Jeste li sigurni da želite izbrisati zaposlenika ${firstName} ${lastName}?\nTime će njegovo ime i aktivnosti nestati iz sustava.`))
            {
                employeesRepository.deleteEmployee(id);
                $scope.allEmployees.splice($scope.allEmployees
                    .findIndex(employee => employee.Id === id), 1);
                activitylogRepository.addActivityLog({
                    Text: `${loginRepository.getManagerName()} je izbrisao zaposlenika ${firstName} ${lastName}`,
                    UserId: loginRepository.getManagerId(),
                    CompanyId: companyId
                });
            }         
        }
    });