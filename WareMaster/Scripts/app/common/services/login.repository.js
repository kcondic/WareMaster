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

        function registerNew(companyName, newUser) {
            return $http.post('/api/register',
                {
                    companyName: companyName,
                    newUser: newUser
                });
        }

        function getCompanyId() {
            const details = localStorage.getItem('authDetails');
            return JSON.parse(details).companyid;
        }

        function getManagerId() {
            const details = localStorage.getItem('authDetails');
            return JSON.parse(details).id;
        }

        function isUserAuthenticated() {
            return localStorage.getItem('bearerToken');
        }

        return {
            login: login,
            registerNew: registerNew,
            getCompanyId: getCompanyId,
            getManagerId: getManagerId,
            isUserAuthenticated: isUserAuthenticated
        };
    });