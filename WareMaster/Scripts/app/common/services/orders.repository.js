angular.module('app').service('ordersRepository',
    function ($http) {
        function getAllOrders() {
            return $http.get('api/orders');
        }

        function addNewOrder(order) {
            return $http.post('api/orders/add', order);
        }

        return {
            getAllOrders: getAllOrders,
            addNewOrder: addNewOrder
        }
    });