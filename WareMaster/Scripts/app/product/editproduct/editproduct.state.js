﻿angular.module('app').config(function ($stateProvider) {
    $stateProvider
        .state('editproduct',
            {
                parent: 'products',
                url: '/edit/:id',
                controller: 'EditProductController',
                templateUrl: '/Scripts/app/product/editproduct/editproduct.template.html'
            });
});