angular.module('app').controller('EditOrderController',
    function ($scope, $state, $stateParams, ordersRepository, employeesRepository, productsRepository, suppliersRepository) {
        $scope.selectedProducts = [];

        ordersRepository.getOrder($stateParams.id).then(function (order) {
            $scope.order = order.data;
            
            $scope.selectedEmployees = $scope.order.AssignedUsers;
            $scope.order.ProductOrders.forEach(function(item) {
                $scope.selectedProducts.push(item.Product);
            });

            $scope.allProducts = $scope.order.Supplier.Products;
            $scope.selectedProducts.forEach(function (item) {
                $scope.allProducts.splice($scope.allProducts.map(function (val) { return val.Id }).indexOf(item.Id), 1);
            });

            employeesRepository.getAllEmployees().then(function (employees) {
                $scope.allEmployees = employees.data;
                $scope.selectedEmployees.forEach(function (item) {
                    $scope.allEmployees.splice($scope.allEmployees.indexOf(item), 1);
                });
            });
        });

        $scope.selectEmployee = function (employee) {
            $scope.selectedEmployees.push(employee);
            $scope.allEmployees.splice($scope.allEmployees.indexOf(employee), 1);
        }

        $scope.deselectEmployee = function (employee) {
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

        $scope.editOrder = function() {
            var productOrder = [];
            for (var i = 0; i < $scope.selectedProducts.length; i++) {
                productOrder.push({
                    ProductId: $scope.selectedProducts[i].Id,
                    OrderId: $scope.order.Id,
                    ProductQuantity: $scope.selectedProducts[i].Counter
                });
            }

            $scope.order.ProductOrders = productOrder;
            $scope.order.AssignedUsers = $scope.selectedEmployees;
            console.log($scope.order);
            console.log($scope.selectedEmployees);
            ordersRepository.editOrder($scope.order).then(function () {
                $state.go('orders', {}, { reload: true });
            });
        }
    });