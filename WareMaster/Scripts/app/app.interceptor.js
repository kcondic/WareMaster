angular.module('app')
    .config(function Config($httpProvider, jwtOptionsProvider) {
        jwtOptionsProvider.config({
            tokenGetter: [function () {
                console.log("pozva je interceptora");
                    console.log(localStorage.getItem('bearerToken'));
                    return localStorage.getItem('bearerToken');
                }
            ]
        });

        $httpProvider.interceptors.push('jwtInterceptor');
    });