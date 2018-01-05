angular.module('app').controller('AddProductController',
    function ($scope, $state, productsRepository, functionsRepository, loginRepository, activitylogRepository) {

        const companyId = loginRepository.getCompanyId();

        $scope.addNewProduct = function () {
            const newProduct = {
                Name: $scope.name,
                Counter: $scope.quantity,
                CompanyId: companyId
            };
            productsRepository.addProduct(newProduct).then(function () {
                activitylogRepository.addActivityLog({
                    Text: `${loginRepository.getManagerName()} je stvorio proizvod ${$scope.name}`,
                    UserId: loginRepository.getManagerId(),
                    CompanyId: companyId
                });
                productsRepository.getIdNeededForImageName().then(function(id) {
                    $scope.id = id.data;
                }).then(function () {
                    functionsRepository.uploadProductImage($scope.file, $scope.name, $scope.id, companyId);
                    $state.go('products', {}, { reload: true });
                });
            });
        }
    });