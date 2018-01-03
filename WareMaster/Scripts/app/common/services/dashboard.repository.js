angular.module('app').service('dashboardRepository',
    function($http) {
        function getActivities() {
            return $http.get('/api/dashboard');
        }

        return {
            getActivities: getActivities
        };
    });