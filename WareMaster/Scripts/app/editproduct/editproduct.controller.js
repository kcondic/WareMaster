angular.module('app').controller('EditProductController',
    function ($scope, $state, $stateParams, productsRepository, functionsRepository) {

        productsRepository.getProductToEdit($stateParams.id).then(function (product) {
            $scope.productToEdit = product.data;
            $scope.name = $scope.productToEdit.Name;
            $scope.quantity = $scope.productToEdit.Counter;
        });

        $scope.editProduct = function () {
            $scope.productToEdit.Name = $scope.name;
            $scope.productToEdit.Counter = $scope.quantity;
            productsRepository.editProduct($scope.productToEdit).then(function () {
                functionsRepository.uploadProductImage($scope.file, $scope.name, $scope.productToEdit.Id);
                $state.go('products', {}, { reload: true });
            });
        }
    });