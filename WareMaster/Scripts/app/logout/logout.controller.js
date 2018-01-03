angular.module('app').controller('LogoutController',
    function ($scope, $state) {
        localStorage.removeItem('bearerToken');
        localStorage.removeItem('authDetails');
        $state.go('login');
    });