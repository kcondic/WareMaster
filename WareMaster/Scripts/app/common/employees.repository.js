angular.module('app').service('employeesRepository',
    function ($http) {

        function getAllEmployees() {
            return $http.get('/api/employees');
        }

        function addEmployee(newEmployee) {
            return $http.post('/api/employees/add', newEmployee);
        }

        return {
            getAllEmployees: getAllEmployees,
            addEmployee: addEmployee
        }

    });