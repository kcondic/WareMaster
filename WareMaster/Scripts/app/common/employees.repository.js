angular.module('app').service('employeesRepository',
    function ($http) {

        function getAllEmployees() {
            return $http.get('/employees');
        }

        return {
            getAllEmployees: getAllEmployees
        }

    });