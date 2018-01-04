angular.module('app').controller('HeaderController',
    function($scope, loginRepository) {
        const authDetails = loginRepository.getAuthDetails();
        if (authDetails) {
            console.log("usa je");
            $scope.userName = authDetails.username;
            $scope.companyName = authDetails.companyname;
        }
    });