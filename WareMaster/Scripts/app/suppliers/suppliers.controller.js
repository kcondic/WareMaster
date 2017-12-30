angular.module('app').controller('SuppliersController',
    function ($scope, suppliersRepository, $rootScope) {

        $rootScope.global = {
            search: ''
        };

        $rootScope.headerdisplayed = true;
        $rootScope.displaysubheader = true;
        $rootScope.productsdisplayed = false;
        $rootScope.employeesdisplayed = false;
        $rootScope.suppliersdisplayed = true;
        $rootScope.choicedisplayed = true;

        var allSuppliersPromise = suppliersRepository.getAllSuppliers();

        allSuppliersPromise.then(function (allSuppliers) {
            $scope.suppliers = allSuppliers.data; 
        });

        $scope.deleteSupplier = function (id, name) {
            if (confirm(`Jeste li sigurni da želite izbrisati dobavljača ${name}?`)) {
                suppliersRepository.deleteSupplier(id);
                $scope.suppliers.splice($scope.suppliers
                    .findIndex(supplier => supplier.Id === id), 1);
            }
        }

    });