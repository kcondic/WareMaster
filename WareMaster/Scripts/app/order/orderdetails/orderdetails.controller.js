angular.module('app').controller('OrderDetailsController',
    function ($scope, $state, $stateParams, ordersRepository, activitylogRepository, loginRepository) {

        const companyId = loginRepository.getCompanyId();

        ordersRepository.getOrderDetails($stateParams.id, companyId).then(function (order) {
            $scope.order = order.data;
            if($scope.order.Supplier)
                $scope.nameOfSupplier = $scope.order.Supplier.Name;
            if ($scope.order.AssignedEmployee)
                $scope.nameOfEmployee = $scope.order.AssignedEmployee.FirstName + ' ' + $scope.order.AssignedEmployee.LastName;
            else
                $scope.nameOfEmployee = 'Nije pridijeljen zaposlenik';
            $scope.options = {
                width: 2,
                height: 100,
                quite: 10,
                displayValue: true,
                font: "monospace",
                textAlign: "center",
                fontSize: 12,
                backgroundColor: "",
                lineColor: "#000"
            };
            $scope.barcode = padString('000000', $scope.order.Id, true);
        }, function () {
            console.log("Nemate dozvolu za pristup tim podacima");
        });

        $scope.deleteOrder = function (id) {
            if (confirm(`Jeste li sigurni da želite otkazati narudžbu?`)) {
                ordersRepository.deleteOrder(id).then(function () {
                    activitylogRepository.addActivityLog({
                        Text: `${loginRepository.getManagerName()} je izbrisao narudžbu`,
                        UserId: loginRepository.getManagerId(),
                        CompanyId: companyId
                    });
                    $state.go('orders', {}, { reload: true });
                });
            }
        }

        function padString(pad, str, padLeft) {
            if (typeof str === 'undefined')
                return pad;
            if (padLeft) {
                return (pad + str).slice(-pad.length);
            } else {
                return (str + pad).substring(0, pad.length);
            }
        }
    });