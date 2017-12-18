angular.module('app').controller('SuppliersController',
    function ($scope, suppliersRepository) {
        $scope.suppliers = [];

        var allSuppliersPromise = suppliersRepository.getAllSuppliers();

        allSuppliersPromise.then(function (allSuppliers) {
            $scope.suppliers = allSuppliers.data;
        });
    });