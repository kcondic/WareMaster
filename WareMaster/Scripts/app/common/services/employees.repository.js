angular.module('app').service('employeesRepository',
    function ($http) {

        function getAllEmployees(companyId) {
            return $http.get('/api/employees',
                {
                    params: {
                        companyId: companyId
                    }
                });
        }

        function addEmployee(newEmployee) {
            return $http.post('/api/employees/add', newEmployee);
        }

        function getEmployeeToEdit(id, companyId) {
            return $http.get('api/employees/edit', 
                {
                params: {
                    id: id,
                    companyId: companyId
                }
            });
        }
        function getEmployeeDetails(id, companyId) {
            return $http.get('api/employees/details',
                {
                    params: {
                        id: id,
                        companyId: companyId
                    }
                });
        }

        function editEmployee(editedEmployee) {
            return $http.post('api/employees/edit', editedEmployee);
        }

        function deleteEmployee(id) {
            return $http.delete('api/employees/delete',
                {
                    params: {
                        id: id
                    }
                });
        }

        return {
            getAllEmployees: getAllEmployees,
            addEmployee: addEmployee,
            getEmployeeToEdit: getEmployeeToEdit,
            getEmployeeDetails: getEmployeeDetails,
            editEmployee: editEmployee,
            deleteEmployee: deleteEmployee
        }
    });