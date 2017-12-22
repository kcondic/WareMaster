angular.module('app').service('productsRepository',
    function ($http) {

        function getAllProducts() {
            return $http.get('/api/products');
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
            addProduct: addProduct,
            getProductToEdit: getProductToEdit,
            editProduct: editProduct,
            deleteProduct: deleteProduct
        }
    });