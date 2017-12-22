angular.module('app').controller('AddSupplierController',
    function ($scope, $state, suppliersRepository, productsRepository) {
        $scope.name = '';
        $scope.productsSelected = [];
        $scope.products = [];

        productsRepository.getAllProducts().then(function (allProducts) {
            $scope.products = allProducts.data;
        });

        $scope.selectProduct = function(product) {
            $scope.productsSelected.push(product);
            $scope.products.splice($scope.products.indexOf(product),  1);
        };

        $scope.addNewSupplier = function () {
            const newSupplier = {
                Name: $scope.name,
                Products: $scope.productsSelected
        }
            suppliersRepository.addNewSupplier(newSupplier).then(function () {
                $state.go('suppliers', {}, { reload: true });
            });
        }
    });