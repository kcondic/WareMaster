angular.module('app').controller('LoginController',
    function ($scope, $state, loginRepository) {

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