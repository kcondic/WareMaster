﻿angular.module('app')
    .config(function Config($httpProvider, jwtOptionsProvider) {
        jwtOptionsProvider.config({
            unauthenticatedRedirectPath: '/',
            tokenGetter: [function () {
                    return localStorage.getItem('bearerToken');
                }
            ]
        });

        $httpProvider.interceptors.push('jwtInterceptor');
    });