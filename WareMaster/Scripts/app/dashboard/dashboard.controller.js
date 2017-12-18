﻿angular.module('app').controller('DashboardController',
    function ($scope, suppliersRepository) {
        $scope.suppliers = [];

        var allSuppliersPromise = suppliersRepository.getAllSuppliers();

        allSuppliersPromise.then(function (allSuppliers) {
            $scope.suppliers = allSuppliers.data;
        });
    });