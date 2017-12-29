angular.module('app')
    .config(function Config($httpProvider, localStorageService, jwtOptionsProvider) {
        jwtOptionsProvider.config({
            tokenGetter: [
                function () {
                    return localStorageService.get('bearerToken');
                }
            ],
            whiteListedDomains: [
                'localhost'
            ]
        });

        $httpProvider.interceptors.push('jwtInterceptor');
    });