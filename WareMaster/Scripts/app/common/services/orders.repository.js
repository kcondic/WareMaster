angular.module('app').service('ordersRepository',
    function ($http) {
        function getAllOrders() {
            return $http.get('api/orders');
        }

        function getOrder(id) {
            return $http.get('api/orders/details',
                {
                    params: {
                        id: id
                    }                       
                });
        }

        function addNewOrder(order) {
            return $http.post('api/orders/add', order);
        }

        function editOrder(editedOrder) {
            return $http.post('api/orders/edit', editedOrder);
        }

        function deleteOrder(id) {
            return $http.delete('api/orders/delete',
                {
                    params: {
                        id: id
                    }
                });
        }

        return {
            getAllOrders: getAllOrders,
            addNewOrder: addNewOrder,
            getOrder: getOrder,
            editOrder: editOrder,
            deleteOrder: deleteOrder
        }
    });