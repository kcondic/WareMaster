angular.module('app').run(function(authManager) {
    authManager.redirectWhenUnauthenticated();
});