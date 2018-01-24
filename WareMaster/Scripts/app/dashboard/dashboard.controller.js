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

    $scope.myDataset = [100, 200, 300, 400, 500];

    //$scope.showWeeks = function () {
    //    if ($scope.allOrders === null)
    //        return false;
    //    else {
    //        $scope.areWeeksSet = SetWeeks();
    //        if ($scope.areWeeksSet) alert($scope.weeks);
    //        return $scope.areWeeksSet;
    //    }
    //}

    //$scope.weeks = [];

    //$scope.SetWeeks = function () {
    //    for (let order in $scope.allOrders) {
    //        var orderTime = order.TimeOfCreation;
    //        var orderWeekDay = new Date(orderTime).getDay();
    //        var firstWeekDay = new Date();
    //        var lastWeekDay = new Date();
    //        var today = new Date();

    //        if (order === $scope.allOrders[0] && today.getDay()===1) {
    //            firstWeekDay.setDate(today.getDate());
    //            lastWeekDay.setDate(today.getDate() + 6);
    //            $scope.weeks.push(firstWeekDay, lastWeekDay);
    //        }
            
    //        firstWeekDay.setDate(orderTime.getDate() - (6 + orderWeekDay)%7);
    //        lastWeekDay.setDate(orderTime.getDate() + (7 - orderWeekDay)%7);
    //        $scope.weeks.push(firstWeekDay, lastWeekDay);
    //    }

    //    if (weeks === null)
    //        return false;
    //    else
    //        return true;
    //}

    //$scope.selectedWeek = [];

    //if (weeks !== null)
    //    $scope.selectedWeek = weeks[0];

    //$scope.setSelectedWeek = function (week) {
    //    $scope.selectedWeek = week;
    //}

    //$scope.getSelectedWeek = function () {
    //    var mWeek1 = $filter('date')($scope.selectedWeek[0], "dd.MM.yyyy.");
    //    var mWeek2 = $filter('date')($scope.selectedWeek[1], "dd.MM.yyyy.");

    //    return mWeek1+'-'+mWeek2;
    //}

    //$scope.setBarHeight = function (barIndex, barOrderType) {
    //    var numberOfOrders = 0;
    //    for ($scope.order in $scope.allOrders) {
    //        if ($scope.order.Status === 0 && barOrderType === $scope.order.Type) {
                
    //        }
    //    }
    //}
});