angular.module('app').controller('MainMenuController',
    function ($scope, $state) {


        $scope.logout = function() {
            localStorage.removeItem('bearerToken');
            localStorage.removeItem('authDetails');
            $state.go('login');
        }
    });