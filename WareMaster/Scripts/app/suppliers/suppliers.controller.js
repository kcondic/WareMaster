angular.module('app').controller('SuppliersController',
    function ($scope, suppliersRepository, loginRepository, activitylogRepository) {

        const companyId = loginRepository.getCompanyId();

        suppliersRepository.getAllSuppliers(companyId).then(function (allSuppliers) {
            $scope.suppliers = allSuppliers.data; 
        });

        $scope.deleteSupplier = function (id, name) {
            if (confirm(`Jeste li sigurni da želite izbrisati dobavljača ${name}?\n Time se moraju izbrisati i sve njegove narudžbe.`)) {
                suppliersRepository.deleteSupplier(id).then(function() {
                    activitylogRepository.addActivityLog({
                        Text: `${loginRepository.getManagerName()} je izbrisao dobavljača ${name}`,
                        UserId: loginRepository.getManagerId(),
                        CompanyId: companyId
                    });
                    $scope.suppliers.splice($scope.suppliers.findIndex(supplier => supplier.Id === id), 1);
                });
            }
        }
    });