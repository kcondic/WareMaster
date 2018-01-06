angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('employees',
            {
                url: '/employees',
                controller: 'EmployeesController',
                templateUrl: '/Scripts/app/employee/employees/employees.template.html'
            });
});