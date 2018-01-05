angular.module('app').service('activitylogRepository',
    function($http) {
        function addActivityLog(newLog) {
            return $http.post('api/activitylogs/add', newLog);
        }

        function getActivityLogs(companyId) {
            return $http.get('api/activitylogs/get',
                {
                    params: {
                        companyId: companyId
                    }
                });
        }

        return {
            addActivityLog: addActivityLog,
            getActivityLogs: getActivityLogs
        };
    });