angular.module('app').controller('EditSupplierController',
    function ($scope, $state, $stateParams, suppliersRepository, productsRepository, loginRepository, activitylogRepository) {

        const companyId = loginRepository.getCompanyId();

        suppliersRepository.getSupplierDetails($stateParams.id, companyId).then(function (supplier) {
            $scope.supplierToEdit = supplier.data;
            $scope.name = $scope.supplierToEdit.Name;
            $scope.products = $scope.supplierToEdit.Products;
            
            productsRepository.getProductsUncontainedInSupplier($stateParams.id, companyId).then(function (products) {
                $scope.otherProducts = products.data;
            });
        }, function () {
            console.log('Nemate dozvolu za pristup tim podacima');
        });

        $scope.selectProduct = function (product) {
            $scope.products.push(product);
            $scope.otherProducts.splice($scope.otherProducts.indexOf(product), 1);
        };

        $scope.deselectProduct = function (product) {
            $scope.otherProducts.push(product);
            $scope.products.splice($scope.products.indexOf(product), 1);
        };

        $scope.editSupplier = function () {
            $scope.supplierToEdit.Name = $scope.name;
            $scope.supplierToEdit.Products = $scope.products;
            suppliersRepository.editSupplier($scope.supplierToEdit).then(function () {
                activitylogRepository.addActivityLog({
                    Text: `${loginRepository.getManagerName()} je uredio dobavljača ${$scope.supplierToEdit.Name}`,
                    UserId: loginRepository.getManagerId(),
                    CompanyId: companyId
                });
                $state.go('suppliers', {}, { reload: true });
            });
        }
    });