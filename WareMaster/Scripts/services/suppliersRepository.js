angular.module('app').service('suppliersRepository',
    function ($http) {

        function getAllSuppliers() {
            return $http.get('/api/suppliers');
        }

        return {
            getAllSuppliers: getAllSuppliers
        }
    });