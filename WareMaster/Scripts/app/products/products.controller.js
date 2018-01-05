angular.module('app').controller('ProductsController',
    function ($scope, $state, productsRepository, loginRepository) {

        const companyId = loginRepository.getCompanyId();

        productsRepository.getAllProducts(companyId).then(function (products) {
            $scope.allProducts = products.data;

            for (let product of $scope.allProducts) {
                const random = (new Date()).toString();
                product.ImageUrl = product.ImageUrl + '?cb=' + random;
            }
        });
    });