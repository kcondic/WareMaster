angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('addemployee',
            {
                parent: 'employees',
                url: '/add',
                controller: 'AddEmployeeController',
                templateUrl: '/Scripts/app/addemployee/addemployee.template.html'
            });
});