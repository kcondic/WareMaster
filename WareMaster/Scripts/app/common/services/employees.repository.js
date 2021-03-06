﻿angular.module('app').service('employeesRepository',
    function ($http) {

        function addEmployee(newEmployee) {
            return $http.post('/api/employees/add', newEmployee);
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
            addEmployee: addEmployee,
            getEmployeeDetails: getEmployeeDetails,
            editEmployee: editEmployee,
            deleteEmployee: deleteEmployee
        }
    });