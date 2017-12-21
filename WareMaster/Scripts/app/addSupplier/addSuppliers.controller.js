angular.module('app').controller('AddSupplierController',
    function ($scope, $state, suppliersRepository) {
        $scope.name = '';

        $scope.addNewSupplier = function () {
            const newSupplier = {
                Name: $scope.name
            }
            suppliersRepository.addNewSupplier(newSupplier).then(function () {
                $state.go('suppliers', {}, { reload: true });
            });
        }
    });