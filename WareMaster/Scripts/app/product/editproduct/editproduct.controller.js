angular.module('app').controller('EditProductController',
    function ($scope, $state, $stateParams, productsRepository, functionsRepository, loginRepository, activitylogRepository) {

        const companyId = loginRepository.getCompanyId();

        productsRepository.getProductDetails($stateParams.id, companyId).then(function (product) {
            $scope.productToEdit = product.data;
            $scope.name = $scope.productToEdit.Name;
            $scope.quantity = $scope.productToEdit.Counter;
            $scope.barcode = $scope.productToEdit.Barcode;
        }, function () {
            console.log("Nemate dozvolu za pristup tim podacima");
        });

        $scope.editProduct = function () {
            $scope.productToEdit.Name = $scope.name;
            $scope.productToEdit.Counter = $scope.quantity;
            $scope.productToEdit.Barcode = $scope.barcode;
            productsRepository.editProduct($scope.productToEdit).then(function () {
                activitylogRepository.addActivityLog({
                    Text: `${loginRepository.getManagerName()} je uredio proizvod ${$scope.productToEdit.Name}`,
                    UserId: loginRepository.getManagerId(),
                    CompanyId: companyId
                });
                functionsRepository.uploadProductImage($scope.file, $scope.name,
                    $scope.productToEdit.Id, $scope.productToEdit.CompanyId);
                $state.go('products', {}, { reload: true });
            });
        }
    });