angular.module('app').controller('AddSupplierController',
    function ($scope, $state, suppliersRepository, productsRepository, loginRepository) {
        $scope.productsSelected = [];
        const companyId = loginRepository.getCompanyId();

        productsRepository.getAllProducts(companyId).then(function (allProducts) {
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
                CompanyId: companyId
        }
            suppliersRepository.addNewSupplier(newSupplier).then(function () {
                $state.go('suppliers', {}, { reload: true });
            });
        }
    });