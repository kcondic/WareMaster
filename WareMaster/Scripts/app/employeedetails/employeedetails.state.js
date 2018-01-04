angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('employeedetails',
            {
                parent: 'employees',
                url: '/details/:id',
                controller: 'EmployeeDetailsController',
                templateUrl: '/Scripts/app/employeedetails/employeedetails.template.html'
            });
});