﻿angular.module('app').controller('AddSupplierController',
    function($scope, $state, suppliersRepository, productsRepository, loginRepository, activitylogRepository, functionsRepository) {
        $scope.productsSelected = [];
        $scope.products = [];
        const companyId = loginRepository.getCompanyId();
        let currentPosition = 0;

        function load() {
            functionsRepository.getTen('products', currentPosition, companyId).then(function(products) {
                $scope.products.push(...products.data);
            });
        }

        $scope.loadMore = function () {
            load();
            currentPosition += 10;
        }

        $scope.selectProduct = function (product) {
            $scope.productsSelected.push(product);
            $scope.products.splice($scope.products.indexOf(product), 1);
        };

        $scope.addNewSupplier = function () {
            const newSupplier = {
                Name: $scope.name,
                Products: $scope.productsSelected,
                CompanyId: companyId,
                Email: $scope.email
            }
            suppliersRepository.addNewSupplier(newSupplier).then(function () {
                activitylogRepository.addActivityLog({
                    Text: `${loginRepository.getManagerName()} je stvorio dobavljača ${$scope.name}`,
                    UserId: loginRepository.getManagerId(),
                    CompanyId: companyId
                });
                $state.go('suppliers', {}, { reload: true });
            });
        }

        $scope.search = function () {
            functionsRepository.searchRequest('products', companyId, $scope.searchText).then(function (foundProducts) {
                if (!$scope.searchText) {
                    $scope.products = [];
                    currentPosition = 0;
                    $scope.loadMore();
                }
                else
                    $scope.products = foundProducts.data;
            });
        }
    });