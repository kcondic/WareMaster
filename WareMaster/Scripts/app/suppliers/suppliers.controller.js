angular.module('app').controller('SuppliersController',
    function ($scope, suppliersRepository) {
        $scope.suppliers = [];
        $scope.supplierToMakeName = '';
        $scope.search = '';

        var allSuppliersPromise = suppliersRepository.getAllSuppliers();

        allSuppliersPromise.then(function (allSuppliers) {
            $scope.suppliers = allSuppliers.data; //.Suppliers;
        });

        $scope.showSupplierDetails = function(supplier) {
            alert(supplier.Name);
        };

    });