angular.module('app').controller('SuppliersController',
function ($scope, suppliersRepository, $rootScope, loginRepository) {

        $rootScope.currentTemplate = 'suppliers';

        suppliersRepository.getAllSuppliers(loginRepository.getCompanyId()).then(function (allSuppliers) {
            $scope.suppliers = allSuppliers.data; 
        });

        $scope.deleteSupplier = function (id, name) {
            if (confirm(`Jeste li sigurni da želite izbrisati dobavljača ${name}?\n Time se moraju izbrisati i sve njegove narudžbe.`)) {
                suppliersRepository.deleteSupplier(id);
                $scope.suppliers.splice($scope.suppliers
                    .findIndex(supplier => supplier.Id === id), 1);
            }
        }

    });