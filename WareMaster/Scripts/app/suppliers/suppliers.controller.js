angular.module('app').controller('SuppliersController',
    function ($scope, suppliersRepository, loginRepository) {

        const companyId = loginRepository.getCompanyId();

        suppliersRepository.getAllSuppliers(companyId).then(function (allSuppliers) {
            $scope.suppliers = allSuppliers.data; 
        });
    });