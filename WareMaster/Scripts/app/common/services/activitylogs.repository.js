angular.module('app').service('activitylogRepository',
    function($http) {
        function addActivityLog(newLog) {
            return $http.post('api/activitylogs/add', newLog);
        }

        return {
            addActivityLog: addActivityLog
        };
    });