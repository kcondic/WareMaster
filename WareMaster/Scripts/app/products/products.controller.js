angular.module('app').controller('ProductsController',
    function ($scope, $state, productsRepository, $rootScope) {

        $rootScope.global = {
            search: ''
        };

        $rootScope.headerdisplayed = true;
        $rootScope.displaysubheader = true;
        $rootScope.productsdisplayed = true;
        $rootScope.employeesdisplayed = false;
        $rootScope.suppliersdisplayed = false;
        $rootScope.choicedisplayed = true;

        productsRepository.getAllProducts().then(function (products) {
            $scope.allProducts = products.data;

            for (let product of $scope.allProducts) {
                const random = (new Date()).toString();
                    product.ImageUrl = product.ImageUrl + '?cb=' + random;
                    $scope.image = true;
                    $scope.alternateimage = false;
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