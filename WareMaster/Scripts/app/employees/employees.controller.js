﻿angular.module('app').controller('EmployeesController',
function ($scope, $state, employeesRepository, $rootScope, loginRepository) {

        $rootScope.currentTemplate = 'employees';

        const companyId = loginRepository.getCompanyId();

        employeesRepository.getAllEmployees(companyId).then(function (employees) {
            $scope.allEmployees = employees.data;

            for (let employee of $scope.allEmployees) {
                const random = (new Date()).toString();
                employee.ImageUrl = employee.ImageUrl + '?cb=' + random;
            }
        });
    });