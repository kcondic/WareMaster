﻿angular.module('app').controller('LoginController',
    function ($scope, $state, loginRepository, $rootScope) {

        $rootScope.currentTemplate = 'login';

        if (loginRepository.isUserAuthenticated())
            $state.go('dashboard');
        else {
            localStorage.removeItem('bearerToken');
            localStorage.removeItem('authDetails');
        }

        $scope.login = function () {
            loginRepository.login($scope.username, $scope.password)
                .then(function () {
                    $state.go('dashboard');
                }, function () {
                    alert('Neispravni korisnički podaci.');
                });
        }

        $scope.logout = function() {
            loginRepository.logout().then(function() {
                $state.go('login');
            });
        }
    });