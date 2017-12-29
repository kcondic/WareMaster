angular.module('app').controller('LoginController',
    function ($scope, $state, loginRepository) {

        $scope.login = function () {
            loginRepository.login($scope.userName, $scope.password)
                .then(function () {
                    $state.go('dashboard');
                }, function () {
                    alert('Neispravni korisnički podaci.');
                });
        }
    });