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

        function registerNew(companyName, managerFirstName, managerLastName, password) {
            return $http.post('/api/register',
                {
                    companyName: companyName,
                    managerFirstName: managerFirstName,
                    managerLastName: managerLastName,
                    password: password
                });
        }

        return {
            login: login,
            registerNew: registerNew
        };
    });