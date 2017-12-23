﻿angular.module('app').controller('ProductsController',
    function ($scope, $state, productsRepository) {

        productsRepository.getAllProducts().then(function (products) {
            $scope.allProducts = products.data;
        });

        $scope.deleteProduct = function (id, name) {
            if (confirm(`Jeste li sigurni da želite izbrisati proizvod ${name}?\nTime će se izbrisati i njegova količina.`)) {
                productsRepository.deleteProduct(id);
                $scope.allProducts.splice($scope.allProducts
                    .findIndex(product => product.Id === id), 1);
            }
        }
    });