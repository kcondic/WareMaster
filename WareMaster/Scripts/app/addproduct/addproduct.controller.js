angular.module('app').controller('AddProductController',
    function ($scope, $state, productsRepository, functionsRepository, jwtHelper) {

        $scope.addNewProduct = function () {
            const newProduct = {
                Name: $scope.name,
                Counter: $scope.quantity
            };
            productsRepository.addProduct(newProduct).then(function () {
                productsRepository.getIdNeededForImageName().then(function(id) {
                    $scope.id = id.data;
                }).then(function() {
                    functionsRepository.uploadProductImage($scope.file, $scope.name, $scope.id);
                    $state.go('products', {}, { reload: true });
                });
            });
        }
    });