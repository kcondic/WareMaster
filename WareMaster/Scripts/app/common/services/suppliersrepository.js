angular.module('app').service('suppliersRepository',
    function ($http) {

        function getAllSuppliers() {
            return $http.get('/api/suppliers');
        }

        function addNewSupplier(newSupplier) {
            return $http.post('/api/suppliers/add', newSupplier);
        }

        function getSupplierToEdit(id) {
            return $http.get('api/suppliers/edit',
                {
                    params: {
                        id: id
                    }
                });
        }

        function editSupplier(editedSupplier) {
            return $http.post('api/suppliers/edit', editedSupplier);
        }

        function deleteSupplier(id) {
            return $http.delete('/api/suppliers/delete',
                {
                    params: {
                        id:id
                    }        
                });
        }

        return {
            getAllSuppliers: getAllSuppliers,
            addNewSupplier: addNewSupplier,
            getSupplierToEdit: getSupplierToEdit,
            editSupplier: editSupplier,
            deleteSupplier: deleteSupplier
        }
    });