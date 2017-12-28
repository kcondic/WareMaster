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
            for (var i = 0; i < $scope.allProducts.length; i++) {
                $scope.allProducts[i].Counter = 1;
            }
        });

        suppliersRepository.getAllSuppliers().then(function (suppliers) {
            $scope.allSuppliers = suppliers.data;
        });

        $scope.suppliersFilter = function (selectedProducts) {
            return function (supplier) {
                return (!selectedProducts.some(val => !supplier.Products.some(x => x.Id === val.Id)));
            }
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
            else if (!$scope.incomingSelect && $scope.selectEmployee === null) {
                alert("Niste dodijelili radnika");
                return;
            }

            var productOrder = [];
            for (var i=0;i< $scope.selectedProducts.length;i++) {
                productOrder.push({
                    ProductId: $scope.selectedProducts[i].Id,
                    ProductQuantity: $scope.selectedProducts[i].Counter
            });
            }
            var supplierId;
            if ($scope.incomingSelected)
                supplierId = document.getElementById("supplierSelect").options[document
                    .getElementById("supplierSelect")
                    .selectedIndex].value;
            else
                supplierId = null;
            var assignedUserId = $scope.selectedEmployee === null ? null : $scope.selectedEmployee.Id;
            
            const newOrder = {
                AssignedUserId: assignedUserId,
                ProductOrders: productOrder,
                Status: 0,
                SupplierId: supplierId
            };

            ordersRepository.addNewOrder(newOrder).then(function () {
                $state.go('orders', {}, { reload: true });
            });
        }
    });