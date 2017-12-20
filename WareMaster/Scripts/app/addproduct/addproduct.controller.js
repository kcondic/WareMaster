angular.module('app').controller('AddProductController',
    function ($scope, $state, productsRepository) {

        $scope.addNewProduct = function () {
            const newProduct = {
                Name: $scope.name,
                Counter: $scope.quantity
            };
            productsRepository.addProduct(newProduct).then(function () {
                $state.go('products', {}, { reload: true });
            });
        }
    });