angular.module('app').controller('DashboardController',
function ($scope, $rootScope, $state, loginRepository, functionsRepository, ordersRepository, $filter) {

    $rootScope.currentTemplate = 'dashboard';
    $scope.activityLogs = [];
    let currentPosition = 0;
    const companyId = loginRepository.getCompanyId();

    function load() {
        functionsRepository.getTen('activitylogs', currentPosition, companyId).then(function (activityLogs) {
        $scope.activityLogs.push(...activityLogs.data);
        });
    }

    $scope.loadMore = function() {
        load();
        currentPosition += 20;
    }

    ordersRepository.getAllOrders(companyId).then(function (allOrders) {
        $scope.allOrders = allOrders.data;
    });

    functionsRepository.getGeneralInfo(companyId).then(function (info) {
        var data = info.data;
        $scope.employeeCount = data.employeeCount;
        $scope.productCount = data.productCount;
        $scope.supplierCount = data.supplierCount;
        $scope.allOrdersCount = data.allOrdersCount;

        var incomingOrdersCount = [data.incomingOrdersPlannedCount, data.incomingOrdersActiveCount, data.incomingOrdersFinishedCount]
        var allIncomingOrdersCount = incomingOrdersCount[0]+incomingOrdersCount[1]+incomingOrdersCount[2];

        var outgoingOrdersCount = [data.outgoingOrdersPlannedCount, data.outgoingOrdersActiveCount, data.outgoingOrdersFinishedCount]
        var allOutgoingOrdersCount = outgoingOrdersCount[0] + outgoingOrdersCount[1] + outgoingOrdersCount[2];

        if (allIncomingOrdersCount === 0) {
            $scope.incomingPlannedOrdersPercentage = 0;
            $scope.incomingActiveOrdersPercentage = 0;
            $scope.incomingFinishedOrdersPercentage = 0;
        } else {
            $scope.incomingPlannedOrdersPercentage = (incomingOrdersCount[0] / allIncomingOrdersCount) * 100;
            $scope.incomingActiveOrdersPercentage = (incomingOrdersCount[1] / allIncomingOrdersCount) * 100;
            $scope.incomingFinishedOrdersPercentage = (incomingOrdersCount[2] / allIncomingOrdersCount) * 100;
        }
        
        if (allOutgoingOrdersCount === 0) {
            $scope.outgoingPlannedOrdersPercentage = 0;
            $scope.outgoingActiveOrdersPercentage = 0;
            $scope.outgoingFinishedOrdersPercentage = 0;
        } else {
            $scope.outgoingPlannedOrdersPercentage = (outgoingOrdersCount[0] / allOutgoingOrdersCount) * 100;
            $scope.outgoingActiveOrdersPercentage = (outgoingOrdersCount[1] / allOutgoingOrdersCount) * 100;
            $scope.outgoingFinishedOrdersPercentage = (outgoingOrdersCount[2] / allOutgoingOrdersCount) * 100;
        }

        
        var emptyIncomingDonut = 0;
        var emptyOutgoingDonut = 0;

        if (allIncomingOrdersCount === 0)
            emptyIncomingDonut = 1;
        else
            emptyIncomingDonut = 0;

        if (allOutgoingOrdersCount === 0)
            emptyOutgoingDonut = 1;
        else
            emptyOutgoingDonut = 0;

        $scope.incomingDonutColours = ['#808080', '#cd5c5c', '#801d1d', '#e6e6e6'];
        $scope.outgoingDonutColours = ['#808080', '#add8e6', '#4682b4', '#e6e6e6'];

        $scope.labels = ["Planirane", "U tijeku", "Izvršene", "Nema narudžbi!"];
        $scope.incomingData = [data.incomingOrdersPlannedCount, data.incomingOrdersActiveCount, data.incomingOrdersFinishedCount, emptyIncomingDonut];
        $scope.outgoingData = [data.outgoingOrdersPlannedCount, data.outgoingOrdersActiveCount, data.outgoingOrdersFinishedCount, emptyOutgoingDonut];


        $scope.series = ['Ulazne izvršene', 'Izlazne izvršene'];
        $scope.barLabels = ['Pon', 'Uto', 'Sri', 'Čet', 'Pet', 'Sub', 'Ned'];
        $scope.barData = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];

        $scope.barColors = ['#4682b4', '#add8e6'];
    });
});