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
            var products = editedSupplier.Products;
            editedSupplier.Products = [];
            var data = { 'supplier': editedSupplier, 'products': products };
            return $http.post('api/suppliers/edit', data);
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