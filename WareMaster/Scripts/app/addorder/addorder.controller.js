angular.module('app').controller('AddOrderController',
    function ($scope, $state, employeesRepository, productsRepository, ordersRepository, suppliersRepository) {

        $scope.selectedEmployees = [];
        $scope.selectedProducts = [];

        employeesRepository.getAllEmployees().then(function (employees) {
            $scope.allEmployees = employees.data;
        });

        productsRepository.getAllProducts().then(function(products) {
            $scope.allProducts = products.data;
        });

        suppliersRepository.getAllSuppliers().then(function (suppliers) {
            $scope.allSuppliers = suppliers.data;
        });

        $scope.suppliersFilter = function (selectedProducts) {
            return function (supplier) {
                return (!selectedProducts.some(val => !supplier.Products.some(x => x.Id === val.Id)));
            }
        }

        $scope.selectEmployee = function (employee) {
            $scope.selectedEmployees.push(employee);
            $scope.allEmployees.splice($scope.allEmployees.indexOf(employee), 1);
        }

        $scope.deselectEmployee = function(employee) {
            $scope.allEmployees.push(employee);
            $scope.selectedEmployees.splice($scope.selectedEmployees.indexOf(employee), 1);
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
            var productOrder = [];
            for (var i=0;i< $scope.selectedProducts.length;i++) {
                productOrder.push({
                    ProductId: $scope.selectedProducts[i].Id,
                    ProductQuantity: $scope.selectedProducts[i].Counter
            });
            }

            const newOrder = {
                AssignedUsers: $scope.selectedEmployees,
                ProductOrders: productOrder,
                Status: 0,
                SupplierId: document.getElementById("supplierSelect").options[document.getElementById("supplierSelect")
                    .selectedIndex].value
            };

            ordersRepository.addNewOrder(newOrder).then(function () {
                $state.go('orders', {}, { reload: true });
            });
        }
    });