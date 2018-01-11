angular.module('app').service('productsRepository',
    function($http) {

        function getAllProducts(companyId) {
            return $http.get('/api/products', {
                params: {
                    companyId: companyId
                }
            });
        }

        function getIdNeededForImageName() {
            return $http.get('/api/products/add');
        }

        function addProduct(newProduct) {
            return $http.post('/api/products/add', newProduct);
        }

        function getProductToEdit(id) {
            return $http.get('api/products/edit',
                {
                    params: {
                        id: id
                    }
                });
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
            getAllProducts: getAllProducts,
            getIdNeededForImageName: getIdNeededForImageName,
            addProduct: addProduct,
            getProductToEdit: getProductToEdit,
            getProductDetails: getProductDetails,
            editProduct: editProduct,
            deleteProduct: deleteProduct
        }
    });