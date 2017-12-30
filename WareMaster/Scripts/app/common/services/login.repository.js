angular.module('app').service('loginRepository',
    function ($http, localStorageService, jwtHelper) {

        function login(username, password) {
            return $http.post('/api/login', {
                username: username,
                password: password
            }).then(function (response) {
                console.log(response);
                localStorage.setItem('bearerToken', response.data);
                const decoded = jwtHelper.decodeToken(response.data);
                console.log(decoded);
                localStorageService.set('authDetails', JSON.stringify(decoded));
            });
        }

        function logout() {
            localStorageService.remove('bearerToken');
            localStorageService.remove('authDetails');
        }

        function isAuthenticated() {
            return !!localStorageService.get('bearerToken');
        }

        function getAuthDetails() {
            return JSON.parse(localStorageService.get('authDetails'));
        }

        return {
            login: login,
            logout: logout,
            isAuthenticated: isAuthenticated,
            getAuthDetails: getAuthDetails
        };
    });