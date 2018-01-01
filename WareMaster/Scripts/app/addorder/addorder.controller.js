angular.module('app').controller('AddOrderController',
    function ($scope, $state, employeesRepository, productsRepository, ordersRepository, suppliersRepository) {

        $scope.incomingSelected = false;
        $scope.outgoingSelected = false;
        $scope.selectedEmployee = null;
        $scope.selectedProducts = [];

        employeesRepository.getAllEmployees().then(function (employees) {
            $scope.allEmployees = employees.data;
        });

        productsRepository.getAllProducts().then(function(products) {
            $scope.allProducts = products.data;
            for (let product of $scope.allProducts)
                product.Counter = 1;
        });

        suppliersRepository.getAllSuppliers().then(function (suppliers) {
            $scope.allSuppliers = suppliers.data;
        });

        $scope.productsFilter = function(selectedSupplierId) {
            return function (product) {
                if ($scope.allSuppliers && selectedSupplierId)
                    return($scope.allSuppliers.find(function(supplier) {
                        return supplier.Id === parseInt(selectedSupplierId);
                    }).Products.some(val => val.Id === product.Id));
                else
                    return false;
            }
        }

        $scope.updateProductsFilter= function() {
            for (let product of $scope.selectedProducts)
                $scope.allProducts.push(product);
            $scope.selectedProducts = [];
        }

        $scope.incomingSelect = function() {
            $scope.incomingSelected = true;
        }

        $scope.outgoingSelect = function () {
            $scope.outgoingSelected = true;
        }

        $scope.selectEmployee = function (employee) {
            if ($scope.selectedEmployee !== null) {
                alert("Već je odabran radnik");
                return;
            }
            $scope.selectedEmployee = employee;
            $scope.allEmployees.splice($scope.allEmployees.indexOf(employee), 1);
        }

        $scope.deselectEmployee = function(employee) {
            $scope.allEmployees.push(employee);
            $scope.selectedEmployee = null;
        }

        $scope.selectProduct = function (product) {
            $scope.selectedProducts.push(product);
            $scope.allProducts.splice($scope.allProducts.indexOf(product), 1);
        }

        $scope.deselectProduct = function (product) {
            $scope.allProducts.push(product);
            $scope.selectedProducts.splice($scope.selectedProducts.indexOf(product), 1);
        }

        $scope.addNewOrder = function () {
            if ($scope.selectedProducts.length === 0) {
                alert("Morate naručiti barem jedan proizvod");
                return;
            }

            var productOrder = [];
            for (let product of $scope.selectedProducts)
                productOrder.push({
                    ProductId: product.Id,
                    ProductQuantity: product.Counter
                });

            var supplierId;
            if ($scope.incomingSelected)
                supplierId = document.getElementById("supplierSelect").options[document
                    .getElementById("supplierSelect")
                    .selectedIndex].value;
            else
                supplierId = null;
            var assignedUser = $scope.selectedEmployee === null ? null : $scope.selectedEmployee;

            const newOrder = {
                AssignedUser: assignedUser,
                AssignedManager: null,
                ProductOrders: productOrder,
                Status: 0,
                Type: $scope.incomingSelected ? 0:1,
                SupplierId: supplierId
            };

            ordersRepository.addNewOrder(newOrder).then(function () {
                $state.go('orders', {}, { reload: true });
            });
        }
    });