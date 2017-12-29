angular.module('app').service('getTokenService',
    function(localStorageService) {

        function get() {
            return localStorageService.get('bearerToken');
        }

        return {
            get: get
        };
    });