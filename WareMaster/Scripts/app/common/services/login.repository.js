angular.module('app').service('loginRepository',
    function($http) {

        function login(email, password) {
            return $http.post('/api/login',
                {
                    email: email,
                    password: password
                }).success(function(response) {
                localStorage.setItem('bearerToken', response);
                const decoded = jwt_decode(response);
                localStorage.setItem('authDetails', JSON.stringify(decoded));
            });
        }

        function logout() {
            localStorage.removeItem('bearerToken');
            localStorage.removeItem('authDetails');
        }

        function isAuthenticated() {
            return !!localStorage.getItem('bearerToken');
        }

        function getAuthDetails() {
            return JSON.parse(localStorage.getItem('authDetails'));
        }

        return {
            login: login,
            logout: logout,
            isAuthenticated: isAuthenticated,
            getAuthDetails: getAuthDetails
        };
    });