angular.module('app').service('ordersRepository',
    function ($http) {
        function getAllOrders(companyId) {
            return $http.get('api/orders', {
                params: {
                    companyId: companyId
                }
            });
        }

        function getOrderDetails(id, companyId) {
            return $http.get('api/orders/details',
                {
                    params: {
                        id: id,
                        companyId: companyId
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
            getOrderDetails:getOrderDetails,
            editOrder: editOrder,
            deleteOrder: deleteOrder
        }
    });