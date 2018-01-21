angular.module('app').controller('EditSupplierController',
    function ($scope, $state, $stateParams, suppliersRepository, productsRepository, loginRepository, activitylogRepository) {

        const companyId = loginRepository.getCompanyId();

        suppliersRepository.getSupplierDetails($stateParams.id, companyId).then(function (supplier) {
            $scope.supplierToEdit = supplier.data;
            $scope.name = $scope.supplierToEdit.Name;
            $scope.products = $scope.supplierToEdit.Products;

            productsRepository.getAllProducts(companyId).then(function (allproducts) {
                $scope.allProducts = allproducts.data.filter(function (el) {
                    return ($scope.products.findIndex(x=> x.Id === el.Id) === -1);
                });
            });
        }, function () {
            console.log('Nemate dozvolu za pristup tim podacima');
        });

        $scope.selectProduct = function (product) {
            $scope.products.push(product);
            $scope.allProducts.splice($scope.allProducts.indexOf(product), 1);
        };

        $scope.deselectProduct = function (product) {
            $scope.allProducts.push(product);
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