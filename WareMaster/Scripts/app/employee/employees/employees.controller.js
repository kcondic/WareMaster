angular.module('app').controller('EmployeesController',
function ($scope, $state, employeesRepository, $rootScope, loginRepository, functionsRepository) {

    $rootScope.currentTemplate = 'employees';
    $scope.employees = [];
    const companyId = loginRepository.getCompanyId();
    let currentPosition = 0;

    function load() {
        functionsRepository.getTen('employees', currentPosition, companyId).then(function(employees) {
            $scope.employees.push(...employees.data);
            for (let employee of $scope.employees) {
                const random = (new Date()).toString();
                employee.ImageUrl = employee.ImageUrl + '?cb=' + random;
            }
        });
    };   

    $scope.loadMore = function () {
        load();
        currentPosition += 10;
    }
});