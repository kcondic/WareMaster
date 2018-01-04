angular.module('app').controller('HeaderController',
    function ($scope, loginRepository) {
        $scope.$on('$locationChangeStart', function () {
            const authDetails = loginRepository.getAuthDetails();
            if (authDetails) {
                $scope.userName = authDetails.username;
                $scope.companyName = authDetails.companyname;
            }
        });       
    });