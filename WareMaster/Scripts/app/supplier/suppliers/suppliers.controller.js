angular.module('app').controller('SuppliersController',
function ($scope, suppliersRepository, $rootScope, loginRepository) {

        $rootScope.currentTemplate = 'suppliers';

        const companyId = loginRepository.getCompanyId();

        suppliersRepository.getAllSuppliers(companyId).then(function (allSuppliers) {
            $scope.suppliers = allSuppliers.data; 
        });
    });