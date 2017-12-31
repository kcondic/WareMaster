angular.module('app').controller('RegisterController',
    function ($scope, $state, loginRepository) {

        $scope.registerNew = function () {
            if ($scope.companyName && $scope.managerFirstName,
                $scope.managerLastName && $scope.username && $scope.password)
                loginRepository.registerNew($scope.companyName,
                    $scope.managerFirstName,
                    $scope.managerLastName,
                    $scope.username,
                    $scope.password).then(function() {
                    $state.go('login');
                });
            else
                alert("Svi podaci su obavezni!");
        }
    });