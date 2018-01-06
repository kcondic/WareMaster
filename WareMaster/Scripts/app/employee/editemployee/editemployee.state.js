angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('editemployee',
            {
                parent: 'employees',
                url: '/edit/:id',
                controller: 'EditEmployeeController',
                templateUrl: '/Scripts/app/employee/editemployee/editemployee.template.html'
            });
});