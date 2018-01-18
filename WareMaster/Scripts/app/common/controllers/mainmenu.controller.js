angular.module('app').controller('MainMenuController',
    function ($scope, $state, loginRepository, activitylogRepository, $rootScope) {
        $scope.wantsToChangePassword = false;
        $scope.wantsToManipulateManagers = false;

        const companyId = loginRepository.getCompanyId();

        $scope.changePassword = function () {
            if(validateInput())
            loginRepository.changePassword($scope.oldPassword, $scope.newPassword)
                .then(function () {
                    alert('Lozinka je uspješno promijenjena.');
                    $scope.wantsToChangePassword = false;
                    $scope.oldPassword = '';
                    $scope.newPassword = '';
                }, function() {
                    alert('Lozinka je neispravna!');
                    $scope.wantsToChangePassword = false;
                    $scope.oldPassword = '';
                    $scope.newPassword = '';
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

        $scope.loadManagers = function () {
            loginRepository.getAllManagers(companyId).then(function(managers) {
                $scope.allManagers = managers.data.filter(manager => manager.Id !== parseInt(loginRepository.getManagerId()));
            }).then(function() {
                $scope.wantsToManipulateManagers = true;
            });
        }

        $scope.deleteManager = function (id, firstName, lastName) {
            if (confirm(`Jeste li sigurni da želite izbrisati menadžera ${firstName} ${lastName}?`)) {
                loginRepository.deleteManager(id).then(function() {
                    activitylogRepository.addActivityLog({
                        Text: `${loginRepository.getManagerName()} je izbrisao menadžera ${firstName} ${lastName}`,
                        UserId: loginRepository.getManagerId(),
                        CompanyId: companyId
                    });
                    $scope.allManagers.splice($scope.allManagers.findIndex(manager => manager.Id === id), 1);
                });
            }
            $scope.wantsToManipulateManagers = false;
        }

        $scope.logout = function () {
            localStorage.removeItem('bearerToken');
            localStorage.removeItem('authDetails');
            $state.go('login');
        }
    });