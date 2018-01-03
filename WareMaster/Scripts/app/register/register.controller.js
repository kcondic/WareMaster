angular.module('app').controller('RegisterController',
    function ($scope, $state, loginRepository, $timeout) {

        var timeoutPromise;
        $scope.checkUsername = function () {
            $scope.userNameExists = false;
            $timeout.cancel(timeoutPromise);
            timeoutPromise = $timeout(function () {
                loginRepository.checkIfUsernameExists($scope.username).then(function (doesUsernameExist) {
                    if (doesUsernameExist.data)
                        $scope.userNameExists = true;
                });
            }, 1000);
        };

        $scope.registerNew = function () {
           // if(validateInput()) {
                const newUser = {
                    FirstName: $scope.managerFirstName,
                    LastName: $scope.managerLastName,
                    Company: null,
                    Role: 1,
                    Username: $scope.username,
                    Password: $scope.password
                };
                loginRepository.registerNew($scope.companyName, newUser).then(function () {
                    $state.go('login');
                });
            //}
        }

        function validateInput() {
            const inputToValidate = [$scope.companyName, $scope.managerFirstName, $scope.managerLastName, $scope.username, $scope.password];
            if (inputToValidate.includes(undefined)) {
                alert('Svi podaci su obavezni!');
                return false;
            }
            for (let input of inputToValidate) {
                if (input.length < 3) {
                    alert('Svako polje mora biti dugo barem 3 znaka!');
                    return false;
                }
                else if (!input[0].match(/[A-Z|a-z|Č|č|Ć|ć|Š|š|Ž|ž|Đ|đ]/i)) {
                    alert('Svako polje mora počinjati sa malim ili velikim slovom!');
                    return false;
                }
            }
            if (/[^a-z0-9]/.test($scope.username)) {
                alert('Korisničko ime smije sadržavati samo engleska mala slova i brojeve!');
                return false;
            }
            if (/[^a-zA-Z0-9]/.test($scope.password)) {
                alert('Lozinka smije sadržavati samo engleska mala i velika slova i brojeve!');
                return false;
            }
            if ($scope.password.length < 6) {
                alert('Lozinka mora sadržavati barem 6 znakova!');
                return false;
            }
            return true;
        }
    });