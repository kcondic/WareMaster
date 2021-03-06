﻿angular.module('app').service('loginRepository',
    function ($http, jwtHelper) {

        function login(username, password) {
            return $http.post('/api/login', {
                username: username,
                password: password
            }).then(function (response) {
                localStorage.setItem('bearerToken', response.data);
                const decoded = jwtHelper.decodeToken(response.data);
                localStorage.setItem('authDetails', JSON.stringify(decoded));
            });
        }

        function registerNew(companyName, newUser) {
            return $http.post('/api/register',
                {
                    companyName: companyName,
                    newUser: newUser
                });
        }

        function registerExisting(newUser) {
            return $http.post('/api/registerexisting', newUser);
        }

        function getCompanyId() {
            const details = localStorage.getItem('authDetails');
            if(details)
                return JSON.parse(details).companyid;
            return 0;
        }

        function getManagerId() {
            const details = localStorage.getItem('authDetails');
            if(details)
                return JSON.parse(details).id;
            return null;
        }

        function getManagerName() {
            const details = localStorage.getItem('authDetails');
            if (details)
                return JSON.parse(details).firstname + ' ' + JSON.parse(details).lastname;
        }

        function isUserAuthenticated() {
            const token = localStorage.getItem('bearerToken');
            if (!token) return false;
            return !jwtHelper.isTokenExpired(token);
        }

        function getAuthDetails() {
            const details = localStorage.getItem('authDetails');
            if(details)
                return JSON.parse(details);
            return null;
        }

        function checkIfUsernameExists(username) {
            return $http.get('/api/register',
                {
                    params: {
                        username: username
                    }
                });
        }

        function changePassword(oldPassword, newPassword) {
            return $http.post('/api/password',
                {
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                    userId: getManagerId()
                });
        }

        function getAllManagers(companyId) {
            return $http.get('/api/managers',
                {
                    params: {
                        companyId: companyId
                    }
                });
        }

        function deleteManager(managerId) {
            return $http.delete('/api/managers',
                {
                    params: {
                        managerId: managerId
                    }
                });
        }

        return {
            login: login,
            registerNew: registerNew,
            registerExisting: registerExisting,
            getCompanyId: getCompanyId,
            getManagerId: getManagerId,
            getManagerName: getManagerName,
            isUserAuthenticated: isUserAuthenticated,
            getAuthDetails: getAuthDetails,
            checkIfUsernameExists: checkIfUsernameExists,
            changePassword: changePassword,
            getAllManagers: getAllManagers,
            deleteManager: deleteManager
        };
    });