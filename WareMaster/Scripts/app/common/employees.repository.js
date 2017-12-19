angular.module('app').service('employeesRepository',
    function ($http) {

        function getAllEmployees() {
            return $http.get('/api/employees');
        }

        function addEmployee(newEmployee) {
            return $http.post('/api/employees/add', newEmployee);
        }

        function getEmployeeToEdit(id) {
            return $http.get('api/employees/edit',
                {
                    params: {
                        id: id
                    }
                });
        }

        function editEmployee(editedEmployee) {
            return $http.post('api/employees/edit', editedEmployee);
        }

        return {
            getAllEmployees: getAllEmployees,
            addEmployee: addEmployee,
            getEmployeeToEdit: getEmployeeToEdit,
            editEmployee: editEmployee
        }
    });