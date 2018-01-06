angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('editorder',
            {
                parent: 'orders',
                url: '/edit/:id',
                controller: 'EditOrderController',
                templateUrl: '/Scripts/app/editorder/editorder.template.html'
            });
});