angular.module('app').controller('EditSupplierController',
    function ($scope, $state, $stateParams, suppliersRepository, productsRepository) {
        $scope.name = '';
        $scope.products = [];
        $scope.allProducts = [];

        suppliersRepository.getSupplierToEdit($stateParams.id).then(function (supplier) {
            $scope.supplierToEdit = supplier.data;
            $scope.name = $scope.supplierToEdit.Name;
            $scope.products = $scope.supplierToEdit.Products;

            productsRepository.getAllProducts().then(function (allproducts) {
            $scope.allProducts = allproducts.data;
            for (var i = 0; i < $scope.products.length; i++)
                for (var j = 0; j < $scope.allProducts.length; j++)
                    if ($scope.products[i].Name === $scope.allProducts[j].Name) {
                        $scope.allProducts.splice(j, 1);
                    }
            });
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
            $scope.supplierToEdit.Products = [];
            for (var i = 0; i < $scope.products.length; i++)
                $scope.supplierToEdit.Products.push($scope.products[i]);
            suppliersRepository.editSupplier($scope.supplierToEdit).then(function () {
                $state.go('suppliers', {}, { reload: true });
            });
        }
        
    });