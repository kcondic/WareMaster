﻿angular.module('app').controller('ProductDetailsController',
    function ($scope, $state, $stateParams, productsRepository, activitylogRepository, loginRepository) {

        const companyId = loginRepository.getCompanyId();

        productsRepository.getProductDetails($stateParams.id, companyId).then(function (product) {
            $scope.product = product.data;
        }, function () {
            console.log("Nemate dozvolu za pristup tim podacima");
        });

        $scope.deleteProduct = function (id, name) {
            if (confirm(`Jeste li sigurni da želite izbrisati proizvod ${name}?\nTime će se izbrisati i njegova količina.`)) {
                productsRepository.deleteProduct(id).then(function () {
                    activitylogRepository.addActivityLog({
                        Text: `${loginRepository.getManagerName()} je izbrisao proizvod ${name}`,
                        UserId: loginRepository.getManagerId(),
                        CompanyId: companyId
                    });
                    $state.go('products', {}, { reload: true });
                });
            }
        }
    });