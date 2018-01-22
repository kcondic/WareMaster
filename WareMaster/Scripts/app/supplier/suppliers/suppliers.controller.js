angular.module('app').controller('SuppliersController',
    function($scope, suppliersRepository, $rootScope, loginRepository, functionsRepository) {

        $rootScope.currentTemplate = 'suppliers';
        $scope.suppliers = [];
        const companyId = loginRepository.getCompanyId();
        let currentPosition = 0;

        function load() {
            functionsRepository.getTen('suppliers', currentPosition, companyId).then(function (suppliers) {
                $scope.suppliers.push(...suppliers.data);
            });
        };

        $scope.loadMore = function () {
            load();
            currentPosition += 10;
        }
    });