angular.module('app').controller('ProductsController',
function ($scope, $state, productsRepository, $rootScope, loginRepository) {

        $rootScope.currentTemplate = 'products';

        productsRepository.getAllProducts(loginRepository.getCompanyId()).then(function (products) {
            $scope.allProducts = products.data;

            for (let product of $scope.allProducts) {
                const random = (new Date()).toString();
                    product.ImageUrl = product.ImageUrl + '?cb=' + random;
            }
        });

        $scope.deleteProduct = function (id, name) {
            if (confirm(`Jeste li sigurni da želite izbrisati proizvod ${name}?\nTime će se izbrisati i njegova količina.`)) {
                productsRepository.deleteProduct(id);
                $scope.allProducts.splice($scope.allProducts
                    .findIndex(product => product.Id === id), 1);
            }
        }
    });