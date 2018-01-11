angular.module('app').controller('AddProductController',
    function ($scope, $state, productsRepository, functionsRepository, loginRepository, activitylogRepository) {

        const companyId = loginRepository.getCompanyId();

        $scope.addNewProduct = function () {
            const newProduct = {
                Name: $scope.name,
                Counter: $scope.quantity,
                Barcode: $scope.barcode,
                CompanyId: companyId
            };
            productsRepository.addProduct(newProduct).then(function (productId) {
                activitylogRepository.addActivityLog({
                    Text: `${loginRepository.getManagerName()} je stvorio proizvod ${$scope.name}`,
                    UserId: loginRepository.getManagerId(),
                    CompanyId: companyId
                });
                $scope.id = parseInt(productId.data);
                functionsRepository.uploadProductImage($scope.file, $scope.name, $scope.id, companyId);
                $state.go('products', {}, { reload: true });
            });
        }
    });