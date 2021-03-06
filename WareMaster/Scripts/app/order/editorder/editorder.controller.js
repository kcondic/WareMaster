﻿angular.module('app').controller('EditOrderController',
    function ($scope, $state, $stateParams, ordersRepository, employeesRepository, productsRepository, loginRepository, activitylogRepository, functionsRepository) {
        $scope.selectedProducts = [];
        $scope.phase = 1;

        $scope.allEmployees = [];
        const companyId = loginRepository.getCompanyId();
        let currentPosition = 0;

        ordersRepository.getOrderDetails($stateParams.id, companyId).then(function (order) {
            $scope.order = order.data;

            $scope.selectedEmployee = $scope.order.AssignedEmployee;
            if ($scope.selectedEmployee)
                $scope.showDeselectX = true;
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
                productsRepository.getProductsUncontainedInOrder($stateParams.id, companyId).then(function (products) {
                    $scope.allProducts = products.data;
                    for (let product of $scope.allProducts)
                        product.Counter = 1;
                });

            for (let product of $scope.selectedProducts) {
                product.Counter = $scope.order.ProductOrders.find(function (productOrder) {
                    return (productOrder.ProductId === product.Id);
                }).ProductQuantity;
            }
            if ($scope.order.Type === 1)
                load();
        }, function () {
            console.log('Nemate dozvolu za pristup tim podacima');
        });

        function load() {
            functionsRepository.getTen('employees', currentPosition, companyId).then(function(employees) {
                $scope.allEmployees.push(...employees.data);
            });
        }

        $scope.loadMore = function () {
            load();
            currentPosition += 10;
        }

        $scope.selectEmployee = function (employee) {
            if ($scope.selectedEmployee !== null) {
                alert('Već je odabran radnik');
                return;
            }
            $scope.selectedEmployee = employee;
            $scope.allEmployees.splice($scope.allEmployees.indexOf(employee), 1);
            $scope.showDeselectX = true;
        }

        $scope.deselectEmployee = function () {
            $scope.selectedEmployee = null;
            $scope.showDeselectX = false;
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
                alert('Morate naručiti barem jedan proizvod');
                return;
            }

            const productOrder = [];
            for (let product of $scope.selectedProducts) 
                productOrder.push({
                    ProductId: product.Id,
                    OrderId: $scope.order.Id,
                    ProductQuantity: product.Counter
                });

            $scope.order.ProductOrders = productOrder;
            $scope.order.AssignedEmployee = $scope.selectedEmployee;

            ordersRepository.editOrder($scope.order).then(function () {
                if ($scope.order.Type === 0)
                    activitylogRepository.addActivityLog({
                        Text: `${loginRepository.getManagerName()} je uredio ulaznu narudžbu`,
                        UserId: loginRepository.getManagerId(),
                        CompanyId: companyId
                    });
                else
                    activitylogRepository.addActivityLog({
                        Text: `${loginRepository.getManagerName()} je uredio izlaznu narudžbu`,
                        UserId: loginRepository.getManagerId(),
                        CompanyId: companyId
                    });
                $state.go('orders', {}, { reload: true });
            });
        }
    });