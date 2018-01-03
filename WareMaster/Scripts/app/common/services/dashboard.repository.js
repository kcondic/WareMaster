angular.module('app').service('dashboardRepository',
    function($http) {
        function getActivities(companyId) {
            return $http.get('/api/dashboard', companyId);
        }

        return {
            getActivities: getActivities
        };
    });