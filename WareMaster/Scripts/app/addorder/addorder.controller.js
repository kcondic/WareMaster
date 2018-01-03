﻿angular.module('app').controller('AddOrderController',
    function ($scope, $state, employeesRepository, productsRepository, ordersRepository, suppliersRepository, loginRepository) {

        $scope.incomingSelected = false;
        $scope.outgoingSelected = false;
        $scope.selectedEmployee = null;
        $scope.selectedProducts = [];

        const companyId = loginRepository.getCompanyId();

        employeesRepository.getAllEmployees(companyId).then(function (employees) {
            $scope.allEmployees = employees.data;
        });

        productsRepository.getAllProducts(companyId).then(function(products) {
            $scope.allProducts = products.data;
        });

        suppliersRepository.getAllSuppliers(companyId).then(function (suppliers) {
            $scope.allSuppliers = suppliers.data;
            $scope.selectedSupplier = $scope.allSuppliers[0];
        });

        $scope.getProductsForSupplier = function () {
            if ($scope.selectedSupplier)
                $scope.allProducts = $scope.selectedSupplier.Products;
            else
                $scope.allProducts = null;
            $scope.selectedProducts = [];
        }

        $scope.incomingSelect = function() {
            $scope.incomingSelected = true;
            if ($scope.selectedSupplier)
                $scope.allProducts = $scope.selectedSupplier.Products;
            else {
                alert("Nemate nijednog dobavljača!\nPrije stvaranja ulazne narudžbe morate dodati barem jednog dobavljača");
                $state.go('orders', {}, { reload: true });
            }
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

            const productOrder = [];
            for (let product of $scope.selectedProducts)
                productOrder.push({
                    ProductId: product.Id,
                    ProductQuantity: product.Counter
                });

            let supplierId;
            if ($scope.incomingSelected)
                supplierId = $scope.selectedSupplier.Id;
            else
                supplierId = null;

            const assignedEmployeeId = !$scope.selectedEmployee ? null : $scope.selectedEmployee.Id;

            const newOrder = {
                AssignedEmployeeId: assignedEmployeeId,
                AssignedManagerId: loginRepository.getManagerId(),
                ProductOrders: productOrder,
                CompanyId: companyId,
                Status: 0,
                Type: $scope.incomingSelected ? 0:1,
                SupplierId: supplierId
            };

            ordersRepository.addNewOrder(newOrder).then(function () {
                $state.go('orders', {}, { reload: true });
            });
        }
    });