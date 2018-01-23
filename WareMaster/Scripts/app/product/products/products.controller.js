angular.module('app').controller('ProductsController',
function ($scope, $state, productsRepository, $rootScope, loginRepository, functionsRepository) {

    $rootScope.currentTemplate = 'products';
    $scope.products = [];
    const companyId = loginRepository.getCompanyId();
    let currentPosition = 0;

    function load() {
        functionsRepository.getTen('products', currentPosition, companyId).then(function(products) {
            $scope.products.push(...products.data);
            for (let product of $scope.products) {
                const random = (new Date()).toString();
                product.ImageUrl = product.ImageUrl + '?cb=' + random;
            }
        });
    };   

    $scope.loadMore = function() {
        load();
        currentPosition += 10;
    }

    $rootScope.search = function (searchText) {
        functionsRepository.searchRequest('products', companyId, searchText).then(function (foundProducts) {
            if (!searchText) {
                $scope.products = [];
                currentPosition = 0;
                $scope.loadMore();
            }
            else
                $scope.products = foundProducts.data;
        });
    }
});