angular.module('app').service('suppliersRepository',
    function ($http) {

        function getAllSuppliers() {
            return $http.get('/api/suppliers');
        }

        function addNewSupplier(newSupplier) {
            return $http.post('/api/suppliers/add', newSupplier);
        }

        return {
            getAllSuppliers: getAllSuppliers,
            addNewSupplier: addNewSupplier
        }
    });