angular.module('app').controller('SupplierDetailsController',
    function ($scope, $state, $stateParams, suppliersRepository, activitylogRepository, loginRepository) {

        const companyId = loginRepository.getCompanyId();

        suppliersRepository.getSupplierDetails($stateParams.id, companyId).then(function (supplier) {
            $scope.supplier = supplier.data;
        }, function () {
            console.log("Nemate dozvolu za pristup tim podacima");
        });

        $scope.deleteSupplier = function (id, name) {
            if (confirm(`Jeste li sigurni da želite izbrisati dobavljača ${name}?\n Time se moraju izbrisati i sve njegove narudžbe.`)) {
                suppliersRepository.deleteSupplier(id).then(function () {
                    activitylogRepository.addActivityLog({
                        Text: `${loginRepository.getManagerName()} je izbrisao dobavljača ${name}`,
                        UserId: loginRepository.getManagerId(),
                        CompanyId: companyId
                    });
                    $state.go("suppliers", {}, { reload: true });
                });
            }
        }
    });