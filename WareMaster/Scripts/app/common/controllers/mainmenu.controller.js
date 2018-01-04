angular.module('app').controller('MainMenuController',
    function ($scope, $state, loginRepository) {
        $scope.wantsToChangePassword = false;
        $scope.wantsToManipulateManagers = false;

        const managerId = loginRepository.getManagerId();

        if(managerId)
        loginRepository.getAllManagers(loginRepository.getCompanyId()).then(function(managers) {
            $scope.allManagers = managers.data.filter(manager => manager.Id !== parseInt(managerId));
        });

        $scope.changePassword = function () {
            if(validateInput())
            loginRepository.changePassword($scope.oldPassword, $scope.newPassword)
                .then(function () {
                    alert('Lozinka je uspješno promijenjena.');
                    $scope.wantsToChangePassword = false;
                }, function() {
                    alert('Lozinka je neispravna!');
                    $scope.wantsToChangePassword = false;
            });
        }

        function validateInput() {
            if (!$scope.oldPassword || !$scope.newPassword) {
                alert('Oba polja su obavezna!');
                return false;
            }
            if (!$scope.newPassword[0].match(/[A-Z|a-z]/i)) {
                alert('Lozinka mora započinjati sa malim ili velikim engleskim slovom!');
            }
            if (/[^a-zA-Z0-9]/.test($scope.newPassword)) {
                alert('Lozinka smije sadržavati samo engleska mala i velika slova i brojeve!');
                return false;
            }
            if ($scope.newPassword.length < 6) {
                alert('Lozinka mora sadržavati barem 6 znakova!');
                return false;
            }
            return true;
        }

        $scope.deleteManager = function(id) {
            
        }

        $scope.logout = function() {
            localStorage.removeItem('bearerToken');
            localStorage.removeItem('authDetails');
            $state.go('login');
        }
    });