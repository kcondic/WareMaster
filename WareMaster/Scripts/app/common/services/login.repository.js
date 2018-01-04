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
            if(details)
                return JSON.parse(details).companyid;
            return 0;
        }

        function getManagerId() {
            const details = localStorage.getItem('authDetails');
            return JSON.parse(details).id;
        }

        function isUserAuthenticated() {
            const details = getAuthDetails();
            if (!details) return false;
             checkIfUsernameExists(details.username).then(function (doesUsernameExist) {
                console.log(doesUsernameExist.data);
                if (!doesUsernameExist.data)
                    return false;
                else {
                    const token = localStorage.getItem('bearerToken');
                    if (!token) return false;
                    return !jwtHelper.isTokenExpired(token);
                }
            });
        }

        function getAuthDetails() {
            const details = localStorage.getItem('authDetails');
            if(details)
                return JSON.parse(details);
            return null;
        }

        function checkIfUsernameExists(username) {
            return $http.get('/api/register',
                {
                    params: {
                        username: username
                    }
                });
        }

        return {
            login: login,
            registerNew: registerNew,
            getCompanyId: getCompanyId,
            getManagerId: getManagerId,
            isUserAuthenticated: isUserAuthenticated,
            getAuthDetails: getAuthDetails,
            checkIfUsernameExists: checkIfUsernameExists
        };
    });