angular.module('app').service('suppliersRepository',
    function ($http) {

        function getAllSuppliers(companyId) {
            return $http.get('api/suppliers/getall',
                {
                    params: {
                        companyId: companyId
                    }
                });
        }

        function addNewSupplier(newSupplier) {
            return $http.post('/api/suppliers/add', newSupplier);
        }

        function getSupplierDetails(id, companyId) {
            return $http.get('api/suppliers/details',
                {
                    params: {
                        id: id,
                        companyId: companyId
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
            getSupplierDetails: getSupplierDetails,
            editSupplier: editSupplier,
            deleteSupplier: deleteSupplier
        }
    });