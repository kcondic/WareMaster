angular.module('app').service('loginRepository',
    function ($http, jwtHelper) {

        function login(username, password) {
            return $http.post('/api/login', {
                username: username,
                password: password
            }).then(function (response) {
                localStorage.setItem('bearerToken', response.data);
                const decoded = jwtHelper.decodeToken(response.data);
                localStorage.setItem('authDetails', JSON.stringify(decoded));
            });
        }

        function isAuthenticated() {
            return !!localStorage.getItem('bearerToken');
        }

        function getAuthDetails() {
            return JSON.parse(localStorage.getItem('authDetails'));
        }

        return {
            login: login,
            isAuthenticated: isAuthenticated,
            getAuthDetails: getAuthDetails
        };
    });