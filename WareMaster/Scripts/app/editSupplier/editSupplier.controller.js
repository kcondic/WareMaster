angular.module('app').controller('EditSupplierController',
    function ($scope, $state, suppliersRepository) {
        $scope.name = '';

        $scope.addNewSupplier = function () {
            const supplier = {
                Name: $scope.name
            }
            suppliersRepository.editSupplier(supplier).then(function () {
                $state.go('suppliers', {}, { reload: true });
            });
        }
    });