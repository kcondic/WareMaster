angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('editemployee',
            {
                parent: 'employees',
                url: '/edit/:id',
                controller: 'EditEmployeeController',
                templateUrl: '/Scripts/app/editemployee/editemployee.template.html'
            });
});