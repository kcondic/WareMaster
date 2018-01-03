angular.module('app').controller('RegisterController',
    function ($scope, $state, loginRepository, $rootScope) {

        $rootScope.currentTemplate = 'register';

        $scope.registerNew = function () {
            if ($scope.companyName && $scope.managerFirstName,
                $scope.managerLastName && $scope.username && $scope.password) {
                const newUser = {
                    FirstName: $scope.managerFirstName,
                    LastName: $scope.managerLastName,
                    Company: null,
                    Role: 1,
                    Username: $scope.username,
                    Password: $scope.password
                };
                loginRepository.registerNew($scope.companyName, newUser).then(function () {
                    $state.go('login');
                });
            }

            else
                alert("Svi podaci su obavezni!");
        }
    });