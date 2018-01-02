angular.module('app').controller('AddSupplierController',
    function ($scope, $state, suppliersRepository, productsRepository, loginRepository) {
        $scope.productsSelected = [];

        productsRepository.getAllProducts(loginRepository.getCompanyId()).then(function (allProducts) {
            $scope.products = allProducts.data;
        });

        $scope.selectProduct = function(product) {
            $scope.productsSelected.push(product);
            $scope.products.splice($scope.products.indexOf(product),  1);
        };

        $scope.addNewSupplier = function () {
            const newSupplier = {
                Name: $scope.name,
                Products: $scope.productsSelected,
                CompanyId: loginRepository.getCompanyId()
        }
            suppliersRepository.addNewSupplier(newSupplier).then(function () {
                $state.go('suppliers', {}, { reload: true });
            });
        }
    });