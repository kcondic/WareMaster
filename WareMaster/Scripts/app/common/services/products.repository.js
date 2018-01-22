angular.module('app').service('productsRepository',
    function ($http) {

        function getProductsUncontainedInSupplier(supplierId, companyId) {
            return $http.get(`/api/products/getuncontainedsupplier`,
                {
                    params: {
                        supplierId: supplierId,
                        companyId: companyId
                    }
                });
        }

        function getProductsUncontainedInOrder(orderId, companyId) {
            return $http.get(`/api/products/getuncontainedorder`,
                {
                    params: {
                        orderId: orderId,
                        companyId: companyId
                    }
                });
        }

        function addProduct(newProduct) {
            return $http.post('api/products/add', newProduct);
        }

        function getProductDetails(id, companyId) {
            return $http.get('api/products/details',
                {
                    params: {
                        id: id,
                        companyId: companyId
                    }
                });
        }

        function editProduct(editedProduct) {
            return $http.post('api/products/edit', editedProduct);
        }

        function deleteProduct(id) {
            return $http.delete('api/products/delete',
                {
                    params: {
                        id: id
                    }
                });
        }

        return {
            getProductsUncontainedInSupplier: getProductsUncontainedInSupplier,
            getProductsUncontainedInOrder: getProductsUncontainedInOrder,
            addProduct: addProduct,
            getProductDetails: getProductDetails,
            editProduct: editProduct,
            deleteProduct: deleteProduct
        }
    });