angular.module('app').controller('EditOrderController',
    function ($scope, $state, $stateParams, ordersRepository, employeesRepository, productsRepository) {
        $scope.selectedProducts = [];

        ordersRepository.getOrder($stateParams.id).then(function (order) {
            $scope.order = order.data;

            $scope.selectedEmployee = $scope.order.AssignedUser;
            $scope.order.ProductOrders.forEach(function(item) {
                $scope.selectedProducts.push(item.Product);
            });

            if ($scope.order.Type === 0) {
                $scope.allProducts = $scope.order.Supplier.Products;
                $scope.selectedProducts.forEach(function (item) {
                    $scope.allProducts.splice($scope.allProducts.map(function (val) { return val.Id }).indexOf(item.Id), 1);
                });
                for (let product of $scope.allProducts)
                    product.Counter = 1;
            }
            else
                productsRepository.getAllProducts().then(function (products) {
                    $scope.allProducts = products.data;
                    $scope.selectedProducts.forEach(function (item) {
                        $scope.allProducts.splice($scope.allProducts.map(function (val) { return val.Id }).indexOf(item.Id), 1);
                    });
                    for (let product of $scope.allProducts)
                        product.Counter = 1;
                });

            for (let product of $scope.selectedProducts) {
                product.Counter = $scope.order.ProductOrders.find(function (productOrder) {
                    return (productOrder.ProductId === product.Id);
                }).ProductQuantity;
            }
            if($scope.order.Type === 1)
                employeesRepository.getAllEmployees().then(function (employees) {
                    $scope.allEmployees = employees.data;
                    if($scope.selectedEmployee !== null)
                    $scope.allEmployees.splice($scope.allEmployees.map(function(val){return val.Id}).indexOf($scope.selectedEmployee.Id), 1);
                });
        });

        $scope.selectEmployee = function (employee) {
            if ($scope.selectedEmployee !== null) {
                alert("Već je odabran radnik");
                return;
            }
            $scope.selectedEmployee = employee;
            $scope.allEmployees.splice($scope.allEmployees.indexOf(employee), 1);
        }

        $scope.deselectEmployee = function (employee) {
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

        $scope.editOrder = function () {
            if ($scope.selectedProducts.length === 0) {
                alert("Morate naručiti barem jedan proizvod");
                return;
            }

            var productOrder = [];
            for (let product of $scope.selectedProducts) 
                productOrder.push({
                    ProductId: product.Id,
                    OrderId: $scope.order.Id,
                    ProductQuantity: product.Counter
                });

            $scope.order.ProductOrders = productOrder;
            $scope.order.AssignedUser = $scope.selectedEmployee;

            ordersRepository.editOrder($scope.order).then(function () {
                $state.go('orders', {}, { reload: true });
            });
        }
    });